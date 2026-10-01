import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// ==========================================
// 1. Users Table
// ==========================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==========================================
// 2. ERP Records Table
// ==========================================
export const erpRecords = mysqlTable("erp_records", {
  id: int("id").autoincrement().primaryKey(),
  referenceNo: varchar("referenceNo", { length: 64 }).notNull(),
  accountCode: varchar("accountCode", { length: 32 }).notNull(),
  accountName: text("accountName").notNull(),
  debit: text("debit").notNull(),
  credit: text("credit").notNull(),
  entryDate: timestamp("entryDate").notNull(),
  createdById: varchar("createdById", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ErpRecord = typeof erpRecords.$inferSelect;
export type InsertErpRecord = typeof erpRecords.$inferInsert;

// ==========================================
// 3. Alerts Table
// ==========================================
export const alertResults = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  severity: mysqlEnum("severity", ["critical", "high", "medium", "low"])
    .default("medium")
    .notNull(),
  details: text("details"),
  erpRecordId: int("erpRecordId"),
  matchId: int("matchId"),
  status: mysqlEnum("status", ["open", "in_progress", "resolved"])
    .default("open")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type Alert = typeof alertResults.$inferSelect;
export type InsertAlert = typeof alertResults.$inferInsert;

// ==========================================
// 4. Settings Table
// ==========================================
export const appSettings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  value: varchar("value", { length: 255 }),
});

export type AppSetting = typeof appSettings.$inferSelect;
export type InsertAppSetting = typeof appSettings.$inferInsert;

// ==========================================
// 5. Audit Working Papers Table
// ==========================================
export const auditWorkingPapers = mysqlTable("audit_working_papers", {
  id: int("id").autoincrement().primaryKey(),
  findingTitle: text("findingTitle").notNull(),
  standardRef: varchar("standardRef", { length: 64 }),
  description: text("description"),
  rootCause: text("rootCause"),
  impactAndRisk: text("impactAndRisk"),
  recommendedAction: text("recommendedAction"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditWorkingPaper = typeof auditWorkingPapers.$inferSelect;
export type InsertAuditWorkingPaper = typeof auditWorkingPapers.$inferInsert;

// ==========================================
// 6. Bank Records Table
// ==========================================
export const bankRecords = mysqlTable("bank_records", {
  id: int("id").autoincrement().primaryKey(),
  referenceNo: varchar("referenceNo", { length: 64 }),
  bankName: varchar("bankName", { length: 255 }),
  amount: text("amount"),
  transactionDate: timestamp("transactionDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BankRecord = typeof bankRecords.$inferSelect;
export type InsertBankRecord = typeof bankRecords.$inferInsert;

// ==========================================
// 7. Match Results Table
// ==========================================
export const matchResults = mysqlTable("match_results", {
  id: int("id").autoincrement().primaryKey(),
  erpRecordId: int("erpRecordId"),
  bankRecordId: int("bankRecordId"),
  matchStatus: varchar("matchStatus", { length: 64 }),
  confidenceScore: text("confidenceScore"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MatchResult = typeof matchResults.$inferSelect;
export type InsertMatchResult = typeof matchResults.$inferInsert;