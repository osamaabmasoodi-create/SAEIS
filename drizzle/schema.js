"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchResults = exports.bankRecords = exports.auditWorkingPapers = exports.appSettings = exports.alertResults = exports.erpRecords = exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
// ==========================================
// 1. Users Table
// ==========================================
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    openId: (0, mysql_core_1.varchar)("openId", { length: 64 }).notNull().unique(),
    name: (0, mysql_core_1.text)("name"),
    email: (0, mysql_core_1.varchar)("email", { length: 320 }),
    loginMethod: (0, mysql_core_1.varchar)("loginMethod", { length: 64 }),
    role: (0, mysql_core_1.mysqlEnum)("role", ["user", "admin"]).default("user").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: (0, mysql_core_1.timestamp)("lastSignedIn").defaultNow().notNull(),
});
// ==========================================
// 2. ERP Records Table
// ==========================================
exports.erpRecords = (0, mysql_core_1.mysqlTable)("erp_records", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    referenceNo: (0, mysql_core_1.varchar)("referenceNo", { length: 64 }).notNull(),
    accountCode: (0, mysql_core_1.varchar)("accountCode", { length: 32 }).notNull(),
    accountName: (0, mysql_core_1.text)("accountName").notNull(),
    debit: (0, mysql_core_1.text)("debit").notNull(),
    credit: (0, mysql_core_1.text)("credit").notNull(),
    entryDate: (0, mysql_core_1.timestamp)("entryDate").notNull(),
    createdById: (0, mysql_core_1.varchar)("createdById", { length: 64 }),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
// ==========================================
// 3. Alerts Table
// ==========================================
exports.alertResults = (0, mysql_core_1.mysqlTable)("alerts", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    title: (0, mysql_core_1.varchar)("title", { length: 300 }).notNull(),
    severity: (0, mysql_core_1.mysqlEnum)("severity", ["critical", "high", "medium", "low"])
        .default("medium")
        .notNull(),
    details: (0, mysql_core_1.text)("details"),
    erpRecordId: (0, mysql_core_1.int)("erpRecordId"),
    matchId: (0, mysql_core_1.int)("matchId"),
    status: (0, mysql_core_1.mysqlEnum)("status", ["open", "in_progress", "resolved"])
        .default("open")
        .notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    resolvedAt: (0, mysql_core_1.timestamp)("resolvedAt"),
});
// ==========================================
// 4. Settings Table
// ==========================================
exports.appSettings = (0, mysql_core_1.mysqlTable)("settings", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    key: (0, mysql_core_1.varchar)("key", { length: 64 }).notNull().unique(),
    value: (0, mysql_core_1.varchar)("value", { length: 255 }),
});
// ==========================================
// 5. Audit Working Papers Table
// ==========================================
exports.auditWorkingPapers = (0, mysql_core_1.mysqlTable)("audit_working_papers", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    findingTitle: (0, mysql_core_1.text)("findingTitle").notNull(),
    standardRef: (0, mysql_core_1.varchar)("standardRef", { length: 64 }),
    description: (0, mysql_core_1.text)("description"),
    rootCause: (0, mysql_core_1.text)("rootCause"),
    impactAndRisk: (0, mysql_core_1.text)("impactAndRisk"),
    recommendedAction: (0, mysql_core_1.text)("recommendedAction"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
// ==========================================
// 6. Bank Records Table
// ==========================================
exports.bankRecords = (0, mysql_core_1.mysqlTable)("bank_records", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    referenceNo: (0, mysql_core_1.varchar)("referenceNo", { length: 64 }),
    bankName: (0, mysql_core_1.varchar)("bankName", { length: 255 }),
    amount: (0, mysql_core_1.text)("amount"),
    transactionDate: (0, mysql_core_1.timestamp)("transactionDate"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
// ==========================================
// 7. Match Results Table
// ==========================================
exports.matchResults = (0, mysql_core_1.mysqlTable)("match_results", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    erpRecordId: (0, mysql_core_1.int)("erpRecordId"),
    bankRecordId: (0, mysql_core_1.int)("bankRecordId"),
    matchStatus: (0, mysql_core_1.varchar)("matchStatus", { length: 64 }),
    confidenceScore: (0, mysql_core_1.text)("confidenceScore"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
