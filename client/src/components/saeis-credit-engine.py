"""
SAEIS - Automated Credit Scoring & Risk Engine
محرك التقييم الائتماني الآلي لتحليل الذمم المدينة وتجنب الديون المعدومة
"""

def calculate_client_credit_score(client_id, total_receivables, credit_limit, dso_days, allowed_credit_days, cpr_rate, overdue_90_days):
    # التحقق من حالات المخاطر القصوى (تعثر طويل الأجل)
    if overdue_90_days > 0 or cpr_rate < 50.0:
        category = 'D'
        action = 'إيقاف فوري للبيع الآجل وتحويل ملف العميل للتحصيل'
        recommended_limit = 0.00
        
    elif cpr_rate >= 90.0 and dso_days <= allowed_credit_days:
        category = 'A'
        action = 'آمن ممتاز - السماح بزيادة السقف الائتماني بنسبة 20%'
        recommended_limit = credit_limit * 1.20
        
    elif cpr_rate >= 75.0:
        category = 'B'
        action = 'جيد - الحفاظ على السقف الائتماني الحالي'
        recommended_limit = credit_limit
        
    else:
        category = 'C'
        action = 'تحت المراقبة - تقييد المبيعات النقدية واشتراط سداد الدفعة السابقة'
        recommended_limit = credit_limit * 0.50  # تخفيض السقف إلى النصف

    return {
        "client_id": client_id,
        "risk_category": category,
        "DSO": f"{dso_days} يوم",
        "CPR": f"{cpr_rate}%",
        "recommended_credit_limit": round(recommended_limit, 2),
        "action_required": action
    }

if __name__ == "__main__":
    # مثال تجريبي لمحاكاة فحص عميل مستخرج من الـ ERP
    sample_eval = calculate_client_credit_score(
        client_id=1042,
        total_receivables=15000.00,
        credit_limit=20000.00,
        dso_days=75,
        allowed_credit_days=30,
        cpr_rate=45.0,
        overdue_90_days=1
    )
    print("نتيجة تحليل العميل:", sample_eval)