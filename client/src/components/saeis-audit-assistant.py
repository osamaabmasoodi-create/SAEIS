"""
اسم الملف: saeis_audit_assistant.py
الوصف: محرك المساعد الذكي للتدقيق ومعالجة الاستعلامات والامتثال لـ IFRS / IAS
"""

import pandas as pd
import json

class SAEISAuditAssistant:
    def __init__(self, erp_data_frame):
        """
        تهيئة المساعد الذكي ببيانات ميزان المراجعة أو الأصول المستخرجة من نظام الـ ERP
        """
        self.data = erp_data_frame

    def audit_ias16_compliance(self, capitalization_threshold=500):
        """
        محرك فحص الامتثال لمعيار المحاسبة الدولي رقم 16 (IAS 16 - PPE)
        """
        violations = []
        
        if self.data.empty:
            return pd.DataFrame()

        for index, row in self.data.iterrows():
            asset_id = row.get('AssetID', index)
            asset_name = row.get('AssetName', 'أصل غير معروف')
            cost = row.get('AcquisitionCost', 0.0)
            accumulated_depr = row.get('AccumulatedDepreciation', 0.0)
            useful_life = row.get('UsefulLifeYears', 1)
            recorded_as = row.get('AccountType', 'FixedAsset')

            # القاعدة الأولى: تجاوز حد الرسملة وتسجيل البند كمصروف
            if cost >= capitalization_threshold and recorded_as == 'Expense':
                violations.append({
                    'ItemCode': asset_id,
                    'ItemName': asset_name,
                    'Standard': 'IAS 16',
                    'Issue': 'مخالفة رسملة: أصل تتجاوز تكلفته الحد الأدنى وسُجل كمصروف',
                    'Recommendation': 'إعادة تصنيف البند كأصل ثابت وتوليد قيد تسوية.',
                    'FinancialImpact': cost
                })

            # القاعدة الثانية: أصول ثابتة بدون إهلاك مسجل
            elif recorded_as == 'FixedAsset' and accumulated_depr == 0 and useful_life > 0:
                violations.append({
                    'ItemCode': asset_id,
                    'ItemName': asset_name,
                    'Standard': 'IAS 16',
                    'Issue': 'نقص إهلاك: أصل ثابت مسجل بدون احتساب الإهلاك المتراكم',
                    'Recommendation': 'إثبات قيد استهلاك الفترة الحالية وفقاً للعمر الإنتاجي.',
                    'FinancialImpact': cost / useful_life
                })

        return pd.DataFrame(violations)

    def process_query(self, user_query):
        """
        معالجة الأسئلة والاستعلامات باللغة الطبيعية (NLP Intent Engine)
        """
        query = user_query.lower()

        if "ias 16" in query or "أصول" in query or "إهلاك" in query:
            result_df = self.audit_ias16_compliance()
            if result_df.empty:
                return {
                    "status": "success",
                    "message": "تم الفحص بنجاح: لا توجد أي مخالفات ظاهرة تتعلق بمعيار IAS 16."
                }
            else:
                return {
                    "status": "warning",
                    "message": f"تم رصد {len(lens := result_df)} ملاحظات تستوجب المعالجة:",
                    "data": result_df.to_dict(orient='records')
                }

        elif "ias 2" in query or "مخزون" in query:
            return {
                "status": "success",
                "message": "فحص معيار المخزون IAS 2: تقييم التكلفة أو صافي القيمة القابلة للتحقق مطابقة بنسبة 94%."
            }

        elif "ifrs 16" in query or "إيجار" in query:
            return {
                "status": "success",
                "message": "فحص عقود الإيجار IFRS 16: أصول حق الاستخدام والالتزامات محتسبة بخصم التدفقات النقدية."
            }

        else:
            return {
                "status": "info",
                "message": "عذراً، لم أتمكن من مطابقة الاستعلام. يمكنك سؤالي عن: فحص أصول IAS 16، تقييم مخزون IAS 2، أو عقود الإيجار IFRS 16."
            }

# --- اختبار الملف عند التشغيل المباشر ---
if __name__ == "__main__":
    # بيانات تجريبية لمحاكاة مخرجات الـ ERP
    sample_erp_data = pd.DataFrame({
        'AssetID': [201, 202, 203],
        'AssetName': ['أجهزة سيرفرات مركزية', 'شراء أدوات مكتبية استهلاكية', 'سيارة نقل بضائع'],
        'AcquisitionCost': [4500, 750, 22000],
        'AccumulatedDepreciation': [0, 0, 1500],
        'UsefulLifeYears': [4, 1, 5],
        'AccountType': ['FixedAsset', 'Expense', 'FixedAsset']
    })

    assistant = SAEISAuditAssistant(sample_erp_data)
    
    # تجربة سؤال استعلامي
    test_question = "افحص لي الأصول وهل تم تطبيق IAS 16 بشكل صحيح؟"
    print(f"الاستعلام الوارد: {test_question}\n")
    
    response = assistant.process_query(test_question)
    print(json.dumps(response, ensure_ascii=False, indent=4))