import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== SAEIS feature queries =====

import { desc } from "drizzle-orm";
import {
  erpRecords,
  bankRecords,
  matchResults,
  alertResults,
} from "../drizzle/schema";
import type { InsertErpRecord, InsertBankRecord, Alert } from "../drizzle/schema";

export async function listErpRecords() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(erpRecords).orderBy(desc(erpRecords.createdAt));
}

export async function insertErpRecords(records: InsertErpRecord[]) {
  const db = await getDb();
  if (!db || records.length === 0) return 0;
  await db.insert(erpRecords).values(records);
  return records.length;
}

export async function listBankRecords() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bankRecords).orderBy(desc(bankRecords.createdAt));
}

export async function insertBankRecords(records: InsertBankRecord[]) {
  const db = await getDb();
  if (!db || records.length === 0) return 0;
  await db.insert(bankRecords).values(records);
  return records.length;
}

export async function listMatches() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(matchResults).orderBy(desc(matchResults.matchedAt));
}

export async function clearMatches() {
  const db = await getDb();
  if (!db) return;
  await db.delete(matchResults);
}

export async function insertMatches(
  rows: Array<{
    erpRecordId: number | null;
    bankRecordId: number | null;
    erpReference: string;
    bankReference: string;
    erpAmount: string;
    bankAmount: string;
    difference: string;
    status: "matched" | "partial" | "unmatched" | "pending_review";
  }>,
) {
  const db = await getDb();
  if (!db || rows.length === 0) return;
  await db.insert(matchResults).values(rows);
}

export async function listAlerts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(alertResults)
    .orderBy(desc(alertResults.severity), desc(alertResults.createdAt));
}

export async function resolveAlert(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db
    .update(alertResults)
    .set({ status: "resolved", resolvedAt: new Date() })
    .where(eq(alertResults.id, id));
  return true;
}

export async function insertAlerts(
  rows: Array<{
    title: string;
    severity: "critical" | "high" | "medium" | "low";
    details: string | null;
    erpRecordId: number | null;
    matchId: number | null;
    status: "open" | "in_progress" | "resolved";
    createdAt: Date;
    resolvedAt: Date | null;
  }>,
) {
  const db = await getDb();
  if (!db || rows.length === 0) return;
  await db.insert(alertResults).values(rows);
}

export async function clearAllData() {
  const db = await getDb();
  if (!db) return;
  await db.delete(alertResults);
  await db.delete(matchResults);
  await db.delete(bankRecords);
  await db.delete(erpRecords);
}

// ===== Matching engine =====

const TOLERANCE_PCT = 0.02; // 2%
const UNMATCHED_DAYS = 7;

function parseAmount(v: string | null | undefined): number | null {
  if (v === null || v === undefined) return null;
  const cleaned = String(v).replace(/[^0-9.\-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function normalizeRef(v: string | null | undefined): string {
  if (!v) return "";
  return String(v).replace(/[^0-9A-Z]/gi, "").toUpperCase();
}

function extractInvoiceNo(text: string | null | undefined): string {
  if (!text) return "";
  // Prefer a full reference like "INV-1025" / "PO-5567" / "CR-022"
  const full = text.match(/((?:INV|PO|CR|PAY|REF)[-_ ]?\s*\d{2,})/i);
  if (full) return normalizeRef(full[1]);
  // Fallback: bare number (e.g. "فاتورة 1024" / "#1024")
  const m = text.match(/#?\s*(\d{3,})/);
  return m ? m[1] : "";
}

export function formatUSD(v: string | number | null | undefined): string {
  const n = typeof v === "number" ? v : parseAmount(String(v ?? ""));
  if (n === null) return "—";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export type EngineResult = {
  rows: Parameters<typeof insertMatches>[0];
  alerts: Parameters<typeof insertAlerts>[0];
};

export function runMatchingEngine(
  erps: Array<{
    id: number;
    referenceNo: string;
    amount: string;
    supplier?: string | null;
    description?: string | null;
    date?: string;
  }>,
  banks: Array<{
    id: number;
    referenceNo: string;
    amount: string;
    party?: string | null;
    description?: string | null;
    date?: string;
  }>,
): EngineResult {
  const rows: Parameters<typeof insertMatches>[0] = [];
  const alerts: Parameters<typeof insertAlerts>[0] = [];
  const matchedBankIds = new Set<number>();
  const erpRefs = new Map<string, (typeof erps)[number]>();
  const erpNumKeys = new Map<string, (typeof erps)[number]>();
  for (const e of erps) {
    const norm = normalizeRef(e.referenceNo);
    if (norm) erpRefs.set(norm, e);
    // Alternate key: the trailing number only (e.g. "INV-1024" → "1024") so a
    // bank movement whose party mentions only the invoice number still matches.
    const num = e.referenceNo.match(/(\d{2,})$/)?.[1];
    if (num) erpNumKeys.set(num, e);
  }
  // 1) match by normalized reference with tolerance on amount
  for (const b of banks) {
    const bRef = normalizeRef(b.referenceNo);
    const bInv = extractInvoiceNo(b.description) || extractInvoiceNo(b.party);
    const candidateKeys: string[] = [];
    if (bRef) candidateKeys.push(bRef);
    if (bInv) candidateKeys.push(bInv);
    let best: {
      e: (typeof erps)[number];
      diffPct: number;
      bankAmount: number;
      erpAmount: number;
    } | null = null;
    for (let i = 0; i < candidateKeys.length; i++) {
      const key = candidateKeys[i];
      const e = erpRefs.get(key) ?? erpNumKeys.get(key);
      if (!e) continue;
      const ea = parseAmount(e.amount);
      const ba = parseAmount(b.amount);
      if (ea === null || ba === null) continue;
      const base = Math.max(Math.abs(ea), Math.abs(ba));
      const diffPct = base > 0 ? Math.abs(Math.abs(ea) - Math.abs(ba)) / base : 0;
      if (!best || diffPct < best.diffPct) {
        best = { e, diffPct, bankAmount: ba, erpAmount: ea };
      }
    }
    if (!best) continue;

    matchedBankIds.add(b.id);
    if (best.diffPct <= TOLERANCE_PCT) {
      rows.push({
        erpRecordId: best.e.id,
        bankRecordId: b.id,
        erpReference: best.e.referenceNo,
        bankReference: b.referenceNo,
        erpAmount: best.e.amount,
        bankAmount: b.amount,
        difference: "0.00",
        status: "matched",
      });
    } else {
      const diff = Math.abs(Math.abs(best.erpAmount) - Math.abs(best.bankAmount));
      rows.push({
        erpRecordId: best.e.id,
        bankRecordId: b.id,
        erpReference: best.e.referenceNo,
        bankReference: b.referenceNo,
        erpAmount: best.e.amount,
        bankAmount: b.amount,
        difference: diff.toFixed(2),
        status: "partial",
      });
      const severity = diff >= 100 ? "critical" : "high";
      alerts.push({
        title: `عدم تطابق في المبلغ — المرجع ${best.e.referenceNo}`,
        severity,
        details: `الفاتورة بقيمة ${formatUSD(best.erpAmount)} مقابل دفعة بنكية بقيمة ${formatUSD(best.bankAmount)} — الفارق ${formatUSD(diff.toFixed(2))}. يُوصى بمراجعة حركة الدفع وحالة الفاتورة.`,
        erpRecordId: best.e.id,
        matchId: null,
        status: "open",
        createdAt: new Date(),
        resolvedAt: null,
      });
    }
  }

  // 2) ERP records with no bank movement
  const matchedErpIds = new Set(
    rows.filter((r) => r.erpRecordId !== null).map((r) => r.erpRecordId as number),
  );
  const now = Date.now();
  for (const e of erps) {
    if (matchedErpIds.has(e.id)) continue;
    const ea = parseAmount(e.amount);
    const ageDays = e.date
      ? Math.floor((now - Date.parse(e.date)) / 86400000)
      : UNMATCHED_DAYS + 1;
    if (ageDays < UNMATCHED_DAYS) {
      rows.push({
        erpRecordId: e.id,
        bankRecordId: null,
        erpReference: e.referenceNo,
        bankReference: "",
        erpAmount: e.amount,
        bankAmount: "0.00",
        difference: ea !== null ? ea.toFixed(2) : "0.00",
        status: "pending_review",
      });
    } else {
      rows.push({
        erpRecordId: e.id,
        bankRecordId: null,
        erpReference: e.referenceNo,
        bankReference: "",
        erpAmount: e.amount,
        bankAmount: "0.00",
        difference: ea !== null ? ea.toFixed(2) : "0.00",
        status: "unmatched",
      });
      alerts.push({
        title: `فاتورة بدون حركة بنكية — المرجع ${e.referenceNo}`,
        severity: ea !== null && ea >= 1000 ? "high" : "medium",
        details: `الفاتورة ${e.referenceNo} بقيمة ${formatUSD(e.amount)} لم تُرصد لها أي حركة في السجل البنكي خلال ${UNMATCHED_DAYS} أيام. تحقق من حالة الدفع.`,
        erpRecordId: e.id,
        matchId: null,
        status: "open",
        createdAt: new Date(),
        resolvedAt: null,
      });
    }
  }

  // 3) bank movements with no matching ERP record
  for (const b of banks) {
    if (matchedBankIds.has(b.id)) continue;
    const ba = parseAmount(b.amount);
    rows.push({
      erpRecordId: null,
      bankRecordId: b.id,
      erpReference: "",
      bankReference: b.referenceNo,
      erpAmount: "0.00",
      bankAmount: b.amount,
      difference: ba !== null ? ba.toFixed(2) : "0.00",
      status: "unmatched",
    });
    alerts.push({
      title: `حركة بنكية غير مرفقة بسجل تشغيلي — ${b.referenceNo}`,
      severity: "medium",
      details: `حركة بنكية بقيمة ${formatUSD(b.amount)} بتاريخ ${b.date || "—"} لم تطابق أي فاتورة أو أمر شراء. قد تكون دفعة مقدمة أو خطأ توثيق.`,
      erpRecordId: null,
      matchId: null,
      status: "open",
      createdAt: new Date(),
      resolvedAt: null,
    });
  }

  return { rows, alerts };
}

export async function runFullMatching(): Promise<EngineResult> {
  const erps = await listErpRecords();
  const banks = await listBankRecords();
  await clearMatches();
  await clearAllAlertsOpen();
  const result = runMatchingEngine(
    erps.map((e) => ({
      id: e.id,
      referenceNo: e.referenceNo,
      amount: e.amount,
      supplier: e.supplier,
      description: e.description,
      date: e.date,
    })),
    banks.map((b) => ({
      id: b.id,
      referenceNo: b.referenceNo,
      amount: b.amount,
      party: b.party,
      description: b.description,
      date: b.date,
    })),
  );
  await insertMatches(result.rows);
  await insertAlerts(result.alerts);
  return result;
}

async function clearAllAlertsOpen() {
  const db = await getDb();
  if (!db) return;
  await db.delete(alertResults);
}

export async function dashboardStats() {
  const erps = await listErpRecords();
  const banks = await listBankRecords();
  const matches = await listMatches();
  const alerts = await listAlerts();

  let totalErp = 0;
  let totalBankOut = 0;
  for (const e of erps) {
    const a = parseAmount(e.amount);
    if (a !== null) totalErp += a;
  }
  for (const b of banks) {
    if (b.direction === "out") {
      const a = parseAmount(b.amount);
      if (a !== null) totalBankOut += a;
    }
  }

  const matched = matches.filter((m) => m.status === "matched").length;
  const partial = matches.filter((m) => m.status === "partial").length;
  const unmatched = matches.filter((m) => m.status === "unmatched").length;
  const pending = matches.filter((m) => m.status === "pending_review").length;

  let discrepancyTotal = 0;
  for (const m of matches) {
    const d = parseAmount(m.difference);
    if (d !== null) discrepancyTotal += d;
  }

  return {
    erpCount: erps.length,
    bankCount: banks.length,
    totalErpAmount: totalErp,
    totalBankOut: totalBankOut,
    matched,
    partial,
    unmatched,
    pending,
    discrepancyTotal,
    openAlerts: alerts.length,
    criticalAlerts: alerts.filter((a) => a.severity === "critical").length,
    lastRun: matches.length > 0 ? matches[0].matchedAt : null,
  };
}
