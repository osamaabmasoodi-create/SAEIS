# ملاحظات بناء MVP SAEIS (محدّث 11:38)

## المشاكل المُنجزة
1. أخطاء TypeScript الـ12 في Home.tsx (سطور 96-123): كانت بسبب استخدام utils.dashboard بدل utils.saeis.dashboard في أوامر invalidate. تم الإصلاح (utils.saeis.*) — tsc: 0 أخطاء.
2. ReferenceError "Cannot access 'saeisRouter' before initialization" (11:30:52): artifact عالق من restart قديم؛ لا يتكرر.
3. محرك المطابقة لا يطابق البيانات التجريبية — إصلاحان في server/db.ts:
   - extractInvoiceNo يستخرج المرجع الكامل (INV-1025/PO-5567/CR-022/PAY/REF) ثم fallback للرقم المجرد.
   - runMatchingEngine: مفاتيح بديلة erpNumKeys (الرقم الختامي فقط مثل "1024") لأن party في البيانات التجريبية "دفعة فاتورة 1024" بلا بادئة INV. المطابقة بالقيمة المطلقة Math.abs(|ea|-|ba|) لتفادي إشكالية CR-022 (-400) مقابل TRX-8834 (+400).
4. vitest: server/saeis.matching.test.ts كل الاختبارات (9) تمر — tolerance 2%، UNMATCHED_DAYS=7، عتبات الشدة (diff>=100→critical، amount>=1000→high، بنكي بلا ERP→medium).

## الحالة
- بعد التعديل الأول فقط: seed أعاد 22 مطابقة / 18 تنبيه لكن INV-1024 ما زالت "بدون حركة بنكية" لأن TRX-8809 (دفعة فاتورة 1024 بقيمة $4,600) لم يطابق.
- بعد التعديل الثاني (erpNumKeys) يجب إعادة seed.demo والتحقق: INV-1024 ↔ TRX-8809 (partial، فارق 400، critical) وCR-022 ↔ TRX-8834 (matched، فارق 0.00).

## أوامر
- seed: curl -s -X POST "https://3000-ih89m2f65n8fjgtro1gae-39cf3eb6.us3.manus.computer/api/trpc/saeis.seed.demo?batch=1" -H "Content-Type: application/json" -d '{"json":null}'
- alerts: curl -s -X GET ".../api/trpc/saeis.alerts.list?batch=1&input=%7B%22json%22%3Anull%7D"
- tsc: pnpm exec tsc --noEmit | tests: pnpm test
- dev URL: https://3000-ih89m2f65n8fjgtro1gae-39cf3eb6.us3.manus.computer

## المتبقي (مُنجز)
1. ✓ seed أعاد: 14 ERP / 13 بنك / 20 مطابقة / 14 تنبيه. INV-1024 ↔ TRX-8809 (partial، فرق 400.00، critical) وCR-022 ↔ TRX-8834 (matched، 0.00).
2. ✓ screenshot يؤكد: KPIs صحيحة، تنبيه INV-1024 حرج بارز، جدول ERP يعرض حالات سليمة/فرق/بدون حركة.
3. ✓ تم اختبار رفع CSV (erpRecords.insert — الصيغة: POST .../api/trpc/saeis.erpRecords.insert?batch=1 بجسم {"0":{"json":{"records":[...]}}}) + resolve تنبيه (alerts.resolve {id}).
4. ✓ vitest 11/11 وtsc صفر أخطاء.
5. ✓ آخر خطوة: webdev_save_checkpoint ثم تسليم.

## بنية
- drizzle/schema.ts: erp_records / bank_records / match_results / alert_results / import_batches / settings + users.
- server/db.ts: runMatchingEngine + runFullMatching + dashboardStats + import/resolve helpers.
- server/saeisRouter.ts: dashboard.stats, erp/bankRecords.list+import, matches.list, alerts.list+resolve, seed.demo+clear. buildDemoData: 14 ERP (INV-1024..INV-1093, PO-5567, CR-022) + 13 بنك (TRX-8801..TRX-8850).
- client: Home.tsx لوحة "غرفة القرار الزمردية" RTL + ERPUploadDialog/BankUploadDialog (رفع CSV).
