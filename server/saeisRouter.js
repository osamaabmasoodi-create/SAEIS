"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.saeisRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("./_core/trpc");
const db = __importStar(require("./db"));
// ===== Shared validators =====
const erpRowSchema = zod_1.z.object({
    referenceNo: zod_1.z.string().min(1).max(64),
    documentType: zod_1.z.enum(["invoice", "po", "credit_note"]).default("invoice"),
    supplier: zod_1.z.string().max(200).optional(),
    date: zod_1.z.string().max(32), // yyyy-mm-dd
    amount: zod_1.z.string().max(32),
    description: zod_1.z.string().optional(),
    source: zod_1.z.enum(["manual", "csv", "demo"]).default("manual"),
});
const bankRowSchema = zod_1.z.object({
    referenceNo: zod_1.z.string().min(1).max(64),
    date: zod_1.z.string().max(32),
    amount: zod_1.z.string().max(32),
    direction: zod_1.z.enum(["in", "out"]).default("out"),
    party: zod_1.z.string().max(200).optional(),
    description: zod_1.z.string().optional(),
    source: zod_1.z.enum(["manual", "csv", "demo"]).default("manual"),
});
// ===== Demo dataset: شركة النور للتجارة =====
function buildDemoData() {
    const erps = [
        { referenceNo: "INV-1024", documentType: "invoice", supplier: "مؤسسة الخليج للتوريدات", date: "2024-05-02", amount: "5000.00", description: "مستلزمات مكتبية — دفعة أولى", source: "demo" },
        { referenceNo: "INV-1025", documentType: "invoice", supplier: "شركة الصناعات المتحدة", date: "2024-05-03", amount: "3250.00", description: "قطع غيار معدات", source: "demo" },
        { referenceNo: "INV-1026", documentType: "invoice", supplier: "مؤسسة الخليج للتوريدات", date: "2024-05-04", amount: "1875.00", description: "أدوات كهربائية", source: "demo" },
        { referenceNo: "INV-1031", documentType: "invoice", supplier: "دار النشر العربي", date: "2024-05-01", amount: "940.00", description: "مواد تدريبية", source: "demo" },
        { referenceNo: "INV-1045", documentType: "invoice", supplier: "الشرق الأوسط للصيانة", date: "2024-05-06", amount: "7200.00", description: "صيانة أنظمة تكييف", source: "demo" },
        { referenceNo: "INV-1052", documentType: "invoice", supplier: "مؤسسة الخليج للتوريدات", date: "2024-05-08", amount: "2600.00", description: "أثاث مكتبي", source: "demo" },
        { referenceNo: "PO-5567", documentType: "po", supplier: "شركة الصناعات المتحدة", date: "2024-05-05", amount: "4100.00", description: "أمر شراء مواد خام", source: "demo" },
        { referenceNo: "INV-1060", documentType: "invoice", supplier: "خدمات النقل السريع", date: "2024-05-09", amount: "1520.00", description: "شحن وتوصيل", source: "demo" },
        { referenceNo: "INV-1061", documentType: "invoice", supplier: "دار النشر العربي", date: "2024-05-10", amount: "890.00", description: "مطبوعات دعائية", source: "demo" },
        { referenceNo: "INV-1072", documentType: "invoice", supplier: "الشرق الأوسط للصيانة", date: "2024-05-12", amount: "3350.00", description: "صيانة دورية المولدات", source: "demo" },
        { referenceNo: "CR-022", documentType: "credit_note", supplier: "مؤسسة الخليج للتوريدات", date: "2024-05-11", amount: "-400.00", description: "إشعار دائن مقابل INV-1024", source: "demo" },
        { referenceNo: "INV-1080", documentType: "invoice", supplier: "شركة الصناعات المتحدة", date: "2024-05-14", amount: "5600.00", description: "تجهيزات مشاريع", source: "demo" },
        { referenceNo: "INV-1088", documentType: "invoice", supplier: "خدمات النقل السريع", date: "2024-05-16", amount: "2210.00", description: "نقل داخلي", source: "demo" },
        { referenceNo: "INV-1093", documentType: "invoice", supplier: "دار النشر العربي", date: "2024-05-18", amount: "1680.00", description: "تصميم وهوية", source: "demo" },
    ];
    const banks = [
        { referenceNo: "TRX-8801", date: "2024-05-03", amount: "3250.00", direction: "out", party: "شركة الصناعات المتحدة — فاتورة INV-1025", source: "demo" },
        { referenceNo: "TRX-8804", date: "2024-05-05", amount: "1875.00", direction: "out", party: "مؤسسة الخليج للتوريدات — INV-1026", source: "demo" },
        { referenceNo: "TRX-8809", date: "2024-05-02", amount: "4600.00", direction: "out", party: "مؤسسة الخليج للتوريدات — دفعة فاتورة 1024", source: "demo" },
        { referenceNo: "TRX-8812", date: "2024-05-07", amount: "7200.00", direction: "out", party: "الشرق الأوسط للصيانة — فاتورة رقم 1045", source: "demo" },
        { referenceNo: "TRX-8815", date: "2024-05-09", amount: "2600.00", direction: "out", party: "مؤسسة الخليج للتوريدات — INV-1052", source: "demo" },
        { referenceNo: "TRX-8818", date: "2024-05-06", amount: "4100.00", direction: "out", party: "شركة الصناعات المتحدة — PO-5567", source: "demo" },
        { referenceNo: "TRX-8822", date: "2024-05-10", amount: "1520.00", direction: "out", party: "خدمات النقل السريع", source: "demo" },
        { referenceNo: "TRX-8825", date: "2024-05-11", amount: "890.00", direction: "out", party: "دار النشر العربي", source: "demo" },
        { referenceNo: "TRX-8830", date: "2024-05-13", amount: "3350.00", direction: "out", party: "الشرق الأوسط للصيانة", source: "demo" },
        { referenceNo: "TRX-8834", date: "2024-05-12", amount: "400.00", direction: "in", party: "إشعار دائن CR-022", source: "demo" },
        { referenceNo: "TRX-8840", date: "2024-05-15", amount: "5600.00", direction: "out", party: "شركة الصناعات المتحدة", source: "demo" },
        { referenceNo: "TRX-8845", date: "2024-05-17", amount: "2210.00", direction: "out", party: "خدمات النقل السريع", source: "demo" },
        { referenceNo: "TRX-8850", date: "2024-05-19", amount: "1680.00", direction: "out", party: "دار النشر العربي", source: "demo" },
    ];
    return { erps, banks };
}
exports.saeisRouter = (0, trpc_1.router)({
    dashboard: {
        stats: trpc_1.publicProcedure.query(async () => db.dashboardStats()),
    },
    erpRecords: {
        list: trpc_1.publicProcedure.query(async () => db.listErpRecords()),
        insert: trpc_1.publicProcedure
            .input(zod_1.z.object({ records: zod_1.z.array(erpRowSchema).min(1).max(500) }))
            .mutation(async ({ input }) => {
            const count = await db.insertErpRecords(input.records);
            await db.runFullMatching();
            return { inserted: count };
        }),
    },
    bankRecords: {
        list: trpc_1.publicProcedure.query(async () => db.listBankRecords()),
        insert: trpc_1.publicProcedure
            .input(zod_1.z.object({ records: zod_1.z.array(bankRowSchema).min(1).max(500) }))
            .mutation(async ({ input }) => {
            const count = await db.insertBankRecords(input.records);
            await db.runFullMatching();
            return { inserted: count };
        }),
    },
    matches: {
        list: trpc_1.publicProcedure.query(async () => db.listMatches()),
    },
    alerts: {
        list: trpc_1.publicProcedure.query(async () => db.listAlerts()),
        resolve: trpc_1.publicProcedure
            .input(zod_1.z.object({ id: zod_1.z.number() }))
            .mutation(async ({ input }) => db.resolveAlert(input.id)),
    },
    seed: {
        demo: trpc_1.publicProcedure.mutation(async () => {
            await db.clearAllData();
            const { erps, banks } = buildDemoData();
            await db.insertErpRecords(erps);
            await db.insertBankRecords(banks);
            const result = await db.runFullMatching();
            return {
                erps: erps.length,
                banks: banks.length,
                matches: result.rows.length,
                alerts: result.alerts.length,
            };
        }),
        clear: trpc_1.publicProcedure.mutation(async () => {
            await db.clearAllData();
            return { cleared: true };
        }),
    },
});
