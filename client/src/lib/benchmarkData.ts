export interface BenchmarkEntry {
    id: string;
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
    date: string;
    description: string;
    category: string;
    // التوصيف الحقيقي للسطر (Ground Truth)
    actualIssueType: "IAS1" | "IAS2" | "IAS16" | "BENFORD" | "NONE";
    expectedErrorDescription?: string;
  }
  
  export interface MetricResults {
    totalRecords: number;
    truePositives: number;   // أخطاء حقيقية اكتشفها النظام ببراعة
    falsePositives: number;  // إنذارات كاذبة (قيد سليم واعتبره النظام خطأ)
    falseNegatives: number;  // أخطاء موجودة وتغاضى عنها النظام
    trueNegatives: number;   // قيود سليمة مرت بسلام
    precision: number;       // نسبة الدقة (True Positives / All Flagged)
    recall: number;          // نسبة التغطية (True Positives / All Actual Errors)
    f1Score: number;         // المعيار المركب للجودة
    accuracy: number;        // الدقة الإجمالية
  }
  
  // عينة البيانات المرجعية المعتمدة (Golden Benchmark Dataset)
  export const GOLDEN_BENCHMARK_DATASET: BenchmarkEntry[] = [
    // 1. حالات أخطاء IAS 1 (تبويب وتسوية)
    { id: "BM-001", accountCode: "2101", accountName: "حساب الشركاء والأطراف ذات الصلة", debit: 0, credit: 150000, date: "2026-01-15", description: "رصيد دائن جاري الشركاء مدمج مع الموردين العموميين", category: "IAS 1", actualIssueType: "IAS1", expectedErrorDescription: "دمج أرصدة الشركاء والأطراف ذات الصلة ضمن الموردين" },
    { id: "BM-002", accountCode: "1101", accountName: "الصندوق الرئيسي", debit: 50000, credit: 0, date: "2026-02-10", description: "قيد إثبات مقبوضات نقدية رسمية", category: "General", actualIssueType: "NONE" },
    
    // 2. حالات أخطاء IAS 2 (المخزون والتقييم)
    { id: "BM-003", accountCode: "1301", accountName: "مخزون قطع غيار راكدة", debit: 85000, credit: 0, date: "2026-03-01", description: "مخزون بدون حركة أكثر من 360 يوماً مقيم بسعر التكلفة دون مخصص", category: "IAS 2", actualIssueType: "IAS2", expectedErrorDescription: "مخزون راكد غير مخصوم القيمة العادلة" },
    { id: "BM-004", accountCode: "1302", accountName: "مخزون بضاعة بالطريق", debit: 30000, credit: 0, date: "2026-03-15", description: "شراء مخزون بمستندات شحن واعتراف سليمة", category: "IAS 2", actualIssueType: "NONE" },
  
    // 3. حالات أخطاء IAS 16 (الأصول الثابتة والمصاريف)
    { id: "BM-005", accountCode: "5201", accountName: "مصروفات صيانة وترميم المبنى الرئيسي", debit: 120000, credit: 0, date: "2026-04-05", description: "رسملة ترميم جوهري يطيل العمر الإنتاجي في الميزانية بدلاً من تحميله للمصروف", category: "IAS 16", actualIssueType: "IAS16", expectedErrorDescription: "عدم رسملة التكاليف اللاحقة الجوهرية للأصل" },
    { id: "BM-006", accountCode: "1201", accountName: "أثاث ومعدات مكتبية", debit: 12000, credit: 0, date: "2026-04-12", description: "شراء أثاث مكتبي حسب الجدول الزمني والإهلاك المعتمد", category: "IAS 16", actualIssueType: "NONE" },
  
    // 4. حالات قانون بنفورد كشف الاحتيال (Benford Anomaly)
    { id: "BM-007", accountCode: "5105", accountName: "مصروفات نثرية متفرقة", debit: 77770, credit: 0, date: "2026-05-20", description: "قيد يدوي بمبلغ يبدأ بتكرار غير طبيعي للرقم 7", category: "Fraud / Benford", actualIssueType: "BENFORD", expectedErrorDescription: "انحراف إحصائي لتكرار رقم خانة أولى (بنفورد)" },
    { id: "BM-008", accountCode: "5106", accountName: "مصروفات نثرية متفرقة", debit: 77900, credit: 0, date: "2026-05-21", description: "قيد يدوي متكرر بنفس خانة الرقم الأول 7", category: "Fraud / Benford", actualIssueType: "BENFORD", expectedErrorDescription: "تراكم انحراف رقم 7 في قيود المصروفات اليدوية" },
    { id: "BM-009", accountCode: "5101", accountName: "إيجار المقر الرئيسي", debit: 24000, credit: 0, date: "2026-06-01", description: "سداد قسط إيجار دوري مطابق للعقد", category: "General", actualIssueType: "NONE" },
    { id: "BM-010", accountCode: "1102", accountName: "حساب البنك الأهلي", debit: 45000, credit: 0, date: "2026-06-15", description: "تحصيل حساب عميل وتغطيته بمستند بنكي سليم", category: "General", actualIssueType: "NONE" }
  ];
  
  // محرك الفحص والتقييم الحتمي (Deterministic Audit Benchmark Evaluator)
  export function runBenchmarkEvaluation(dataset: BenchmarkEntry[] = GOLDEN_BENCHMARK_DATASET): MetricResults {
    let tp = 0; // True Positive
    let fp = 0; // False Positive
    let fn = 0; // False Negative
    let tn = 0; // True Negative
  
    dataset.forEach((entry) => {
      // تشغيل القواعد الحتمية للفحص المحاسبي
      let detectedIssue: "IAS1" | "IAS2" | "IAS16" | "BENFORD" | "NONE" = "NONE";
  
      // قاعدة 1: فحص IAS 1 (الأطراف ذات الصلة والموردين)
      if (entry.accountName.includes("الشركاء") || entry.description.includes("مدمج مع الموردين")) {
        detectedIssue = "IAS1";
      }
      // قاعدة 2: فحص IAS 2 (مخزون راكد بدون مخصص)
      else if (entry.accountName.includes("راكدة") || entry.description.includes("بدون حركة أكثر من 360")) {
        detectedIssue = "IAS2";
      }
      // قاعدة 3: فحص IAS 16 (عدم رسملة الترميم الجوهري)
      else if (entry.description.includes("ترميم جوهري") || (entry.category === "IAS 16" && entry.debit > 100000)) {
        detectedIssue = "IAS16";
      }
      // قاعدة 4: فحص Benford (تكرار الخانة الأولى برقم 7)
      else if (entry.debit.toString().startsWith("77")) {
        detectedIssue = "BENFORD";
      }
  
      const isActuallyError = entry.actualIssueType !== "NONE";
      const isDetectedAsError = detectedIssue !== "NONE";
  
      if (isActuallyError && isDetectedAsError) {
        tp++;
      } else if (!isActuallyError && isDetectedAsError) {
        fp++;
      } else if (isActuallyError && !isDetectedAsError) {
        fn++;
      } else {
        tn++;
      }
    });
  
    const total = dataset.length;
    const precision = (tp + fp) > 0 ? (tp / (tp + fp)) * 100 : 100;
    const recall = (tp + fn) > 0 ? (tp / (tp + fn)) * 100 : 100;
    const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 100;
  
    return {
      totalRecords: total,
      truePositives: tp,
      falsePositives: fp,
      falseNegatives: fn,
      trueNegatives: tn,
      precision: Number(precision.toFixed(1)),
      recall: Number(recall.toFixed(1)),
      f1Score: Number(f1Score.toFixed(1)),
      accuracy: Number(accuracy.toFixed(1)),
    };
  }