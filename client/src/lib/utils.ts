import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1. تعريف واجهة القيد المحاسبي
export interface JournalLine {
  lineNo: number;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  memo: string;
}

export interface GeneratedJournalEntry {
  reference: string;
  date: string;
  description: string;
  currency: string;
  totalAmount: number;
  lineItems: JournalLine[];
}

// 2. دالة توليد قيد التسوية المحاسبي التلقائي وفق معيار IAS 2 (NRV)
export const generateNRVAdjustmentJournalEntry = (
  totalNrvWriteDown: number,
  currency: string = "USD"
): GeneratedJournalEntry | null => {
  if (totalNrvWriteDown <= 0) return null;

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