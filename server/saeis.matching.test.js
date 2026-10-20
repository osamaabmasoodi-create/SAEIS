"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Pure re-implementation of the matching logic in server/db.ts (buildMatches)
// for deterministic unit testing of the core reconciliation algorithm.
const TOLERANCE_PCT = 0.02;
const UNMATCHED_DAYS = 7;
function parseAmount(raw) {
    const cleaned = String(raw).replace(/[^\d.-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
}
function formatUSD(n) {
    return `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function buildMatches(erps, banks) {
    const rows = [];
    const alerts = [];
    const matchedBankIds = new Set();
    // Mirrors runMatchingEngine in server/db.ts: match from the bank side using
    // the bank reference plus any invoice/PO/CR reference (full or bare number)
    // mentioned in the party text, comparing amounts by absolute value.
    function normalizeRef(v) {
        return v.replace(/[^0-9A-Z]/gi, "").toUpperCase();
    }
    function extractInvoiceNo(text) {
        if (!text)
            return "";
        const full = text.match(/((?:INV|PO|CR|PAY|REF)[-_ ]?\s*\d{2,})/i);
        if (full)
            return normalizeRef(full[1]);
        const m = text.match(/#?\s*(\d{3,})/);
        return m ? m[1] : "";
    }
    const erpByRef = new Map();
    const erpByNum = new Map();
    for (const e of erps) {
        const norm = normalizeRef(e.referenceNo);
        if (norm)
            erpByRef.set(norm, e);
        const num = e.referenceNo.match(/(\d{2,})$/)?.[1];
        if (num)
            erpByNum.set(num, e);
    }
    // 1) Match by reference (bank-side scan)
    for (const b of banks) {
        const keys = [];
        const bRef = normalizeRef(b.referenceNo);
        if (bRef)
            keys.push(bRef);
        const bInv = extractInvoiceNo(b.party ?? null);
        if (bInv)
            keys.push(bInv);
        let best = null;
        for (const key of keys) {
            const e = erpByRef.get(key) ?? erpByNum.get(key);
            if (!e)
                continue;
            const ea = parseAmount(e.amount);
            const ba = parseAmount(b.amount);
            if (ea === null || ba === null)
                continue;
            const base = Math.max(Math.abs(ea), Math.abs(ba));
            const diffPct = base > 0 ? Math.abs(Math.abs(ea) - Math.abs(ba)) / base : 0;
            if (!best || diffPct < best.diffPct)
                best = { e, bank: b, diffPct };
        }
        if (!best)
            continue;
        matchedBankIds.add(best.bank.id);
        const ea = Math.abs(parseAmount(best.e.amount));
        const ba = Math.abs(parseAmount(best.bank.amount));
        if (best.diffPct <= TOLERANCE_PCT) {
            rows.push({
                erpRecordId: best.e.id,
                bankRecordId: best.bank.id,
                erpReference: best.e.referenceNo,
                bankReference: best.bank.referenceNo,
                difference: "0.00",
                status: "matched",
            });
        }
        else {
            const diff = Math.abs(ea - ba);
            rows.push({
                erpRecordId: best.e.id,
                bankRecordId: best.bank.id,
                erpReference: best.e.referenceNo,
                bankReference: best.bank.referenceNo,
                difference: diff.toFixed(2),
                status: "partial",
            });
            alerts.push({
                title: `عدم تطابق في المبلغ — المرجع ${best.e.referenceNo}`,
                severity: diff >= 100 ? "critical" : "high",
            });
        }
    }
    // 2) ERP records with no bank movement
    const matchedErpIds = new Set(rows.map((r) => r.erpRecordId).filter((v) => v !== null));
    const now = Date.now();
    for (const e of erps) {
        if (matchedErpIds.has(e.id))
            continue;
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
                difference: ea !== null ? ea.toFixed(2) : "0.00",
                status: "pending_review",
            });
        }
        else {
            rows.push({
                erpRecordId: e.id,
                bankRecordId: null,
                erpReference: e.referenceNo,
                bankReference: "",
                difference: ea !== null ? ea.toFixed(2) : "0.00",
                status: "unmatched",
            });
            alerts.push({
                title: `فاتورة بدون حركة بنكية — المرجع ${e.referenceNo}`,
                severity: ea !== null && ea >= 1000 ? "high" : "medium",
            });
        }
    }
    // 3) Bank movements with no ERP record
    for (const b of banks) {
        if (matchedBankIds.has(b.id))
            continue;
        rows.push({
            erpRecordId: null,
            bankRecordId: b.id,
            erpReference: "",
            bankReference: b.referenceNo,
            difference: (parseAmount(b.amount) ?? 0).toFixed(2),
            status: "unmatched",
        });
        alerts.push({ title: `حركة بنكية غير مرفقة — ${b.referenceNo}`, severity: "medium" });
    }
    return { rows, alerts };
}
function rec(d) {
    return d;
}
(0, vitest_1.describe)("SAEIS reconciliation engine (buildMatches)", () => {
    (0, vitest_1.it)("matches identical ERP and bank records with zero difference", () => {
        const r = { id: 1, referenceNo: "INV-1001", amount: "1200.00" };
        const { rows, alerts } = buildMatches([r], [r]);
        (0, vitest_1.expect)(rows).toHaveLength(1);
        (0, vitest_1.expect)(rows[0].status).toBe("matched");
        (0, vitest_1.expect)(rows[0].difference).toBe("0.00");
        (0, vitest_1.expect)(alerts).toHaveLength(0);
    });
    (0, vitest_1.it)("flags the Invoice #1024 scenario ($5,000 vs $4,600) as partial + critical alert", () => {
        const erp = { id: 1, referenceNo: "INV-1024", amount: "5000.00" };
        const bank = { id: 2, referenceNo: "INV-1024", amount: "4600.00" };
        const { rows, alerts } = buildMatches([erp], [bank]);
        (0, vitest_1.expect)(rows).toHaveLength(1);
        (0, vitest_1.expect)(rows[0].status).toBe("partial");
        (0, vitest_1.expect)(rows[0].difference).toBe("400.00");
        (0, vitest_1.expect)(alerts).toHaveLength(1);
        (0, vitest_1.expect)(alerts[0].severity).toBe("critical"); // diff >= 100
    });
    (0, vitest_1.it)("marks small within-tolerance differences as fully matched", () => {
        // 2% tolerance: $1000 vs $1015 → 1.5% → matched
        const erp = { id: 1, referenceNo: "REF-5", amount: "1000.00" };
        const bank = { id: 2, referenceNo: "REF-5", amount: "1015.00" };
        const { rows, alerts } = buildMatches([erp], [bank]);
        (0, vitest_1.expect)(rows[0].status).toBe("matched");
        (0, vitest_1.expect)(rows[0].difference).toBe("0.00");
        (0, vitest_1.expect)(alerts).toHaveLength(0);
    });
    (0, vitest_1.it)("flags large over-tolerance differences as partial with high-severity alert", () => {
        // $1000 vs $1030 → 2.9% → partial; diff 30 < 100 → high
        const erp = { id: 1, referenceNo: "REF-6", amount: "1000.00" };
        const bank = { id: 2, referenceNo: "REF-6", amount: "1030.00" };
        const { rows, alerts } = buildMatches([erp], [bank]);
        (0, vitest_1.expect)(rows[0].status).toBe("partial");
        (0, vitest_1.expect)(rows[0].difference).toBe("30.00");
        (0, vitest_1.expect)(alerts[0].severity).toBe("high");
    });
    (0, vitest_1.it)("treats recent ERP records with no bank movement as pending_review (no alert)", () => {
        const erp = {
            id: 1,
            referenceNo: "INV-NEW",
            amount: "500.00",
            date: rec(new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10)),
        };
        const { rows, alerts } = buildMatches([erp], []);
        (0, vitest_1.expect)(rows[0].status).toBe("pending_review");
        (0, vitest_1.expect)(alerts).toHaveLength(0);
    });
    (0, vitest_1.it)("alerts when an ERP invoice has no bank movement for over a week", () => {
        const erp = {
            id: 1,
            referenceNo: "INV-OLD",
            amount: "2500.00",
            date: rec(new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)),
        };
        const { rows, alerts } = buildMatches([erp], []);
        (0, vitest_1.expect)(rows[0].status).toBe("unmatched");
        (0, vitest_1.expect)(alerts).toHaveLength(1);
        (0, vitest_1.expect)(alerts[0].severity).toBe("high"); // amount >= 1000
    });
    (0, vitest_1.it)("matches via bare invoice number mentioned in the bank movement party text", () => {
        // Real-world scenario: bank statement party is "دفعة فاتورة 1024" with no
        // "INV" prefix, while the ERP reference is "INV-1024".
        const erp = { id: 1, referenceNo: "INV-1024", amount: "5000.00" };
        const bank = {
            id: 2,
            referenceNo: "TRX-8809",
            amount: "4600.00",
            party: "مؤسسة الخليج للتوريدات — دفعة فاتورة 1024",
        };
        const { rows, alerts } = buildMatches([erp], [bank]);
        (0, vitest_1.expect)(rows).toHaveLength(1);
        (0, vitest_1.expect)(rows[0].erpReference).toBe("INV-1024");
        (0, vitest_1.expect)(rows[0].bankReference).toBe("TRX-8809");
        (0, vitest_1.expect)(rows[0].status).toBe("partial");
        (0, vitest_1.expect)(rows[0].difference).toBe("400.00");
        (0, vitest_1.expect)(alerts[0].severity).toBe("critical");
    });
    (0, vitest_1.it)("treats credit note amounts by absolute value when matching", () => {
        // Credit note of -$400 should match a bank credit of +$400 with zero gap.
        const erp = { id: 1, referenceNo: "CR-022", amount: "-400.00" };
        const bank = { id: 2, referenceNo: "TRX-8834", amount: "400.00", party: "إشعار دائن CR-022" };
        const { rows, alerts } = buildMatches([erp], [bank]);
        (0, vitest_1.expect)(rows[0].status).toBe("matched");
        (0, vitest_1.expect)(rows[0].difference).toBe("0.00");
        (0, vitest_1.expect)(alerts).toHaveLength(0);
    });
    (0, vitest_1.it)("flags bank-only movements as medium-severity unmatched alerts", () => {
        const bank = { id: 1, referenceNo: "TRF-99", amount: "800.00" };
        const { rows, alerts } = buildMatches([], [bank]);
        (0, vitest_1.expect)(rows[0].status).toBe("unmatched");
        (0, vitest_1.expect)(alerts[0].severity).toBe("medium");
    });
    (0, vitest_1.it)("computes mixed-batch results consistent with the demo scenario", () => {
        const erps = [
            { id: 1, referenceNo: "A", amount: "100.00" },
            { id: 2, referenceNo: "B", amount: "5000.00" },
            { id: 3, referenceNo: "C", amount: "3000.00" },
        ];
        const banks = [
            { id: 10, referenceNo: "A", amount: "100.00" },
            { id: 11, referenceNo: "B", amount: "4600.00" },
        ];
        const { rows, alerts } = buildMatches(erps, banks);
        (0, vitest_1.expect)(rows).toHaveLength(3);
        const byRef = (ref) => rows.find((r) => r.erpReference === ref || r.bankReference === ref);
        (0, vitest_1.expect)(byRef("A").status).toBe("matched");
        (0, vitest_1.expect)(byRef("B").status).toBe("partial");
        (0, vitest_1.expect)(byRef("B").difference).toBe("400.00");
        (0, vitest_1.expect)(byRef("C").status).toBe("unmatched"); // C has no bank row
        (0, vitest_1.expect)(alerts.map((a) => a.severity).sort()).toEqual(["critical", "high"].sort());
    });
});
