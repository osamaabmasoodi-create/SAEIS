"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNRVAdjustmentJournalEntry = void 0;
exports.cn = cn;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
// 2. دالة توليد قيد التسوية المحاسبي التلقائي وفق معيار IAS 2 (NRV)
const generateNRVAdjustmentJournalEntry = (totalNrvWriteDown, currency = "USD") => {
    if (totalNrvWriteDown <= 0)
        return null;
    const today = new Date().toISOString().split('T')[0];
    return {
        reference: `JV-NRV-${today.replace(/-/g, '')}`,
        date: today,
        description: "قيد تسوية تقييم المخزون بأقل التكلفة أو صافي القيمة القابلة للتحقق (IAS 2)",
        currency: currency,
        totalAmount: totalNrvWriteDown,
        lineItems: [
            {
                lineNo: 1,
                accountCode: "510901",
                accountName: "تكلفة البضاعة المباعة - خسائر هبوط أسعار المخزون",
                debit: totalNrvWriteDown,
                credit: 0,
                memo: "إثبات خسائر انخفاض NRV عن التكلفة"
            },
            {
                lineNo: 2,
                accountCode: "120901",
                accountName: "مخصص هبوط أسعار المخزون (Allowance for NRV)",
                debit: 0,
                credit: totalNrvWriteDown,
                memo: "إثبات المخصص المقابل لتخفيض قيمة المخزون"
            }
        ]
    };
};
exports.generateNRVAdjustmentJournalEntry = generateNRVAdjustmentJournalEntry;
