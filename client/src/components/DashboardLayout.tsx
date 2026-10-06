{/* ========================================================= */}
{/* محرك التقييم الائتماني التلقائي للعملاء (SAEIS Credit Engine) */}
{/* ========================================================= */}
<div className="p-6 bg-[#252526] text-gray-100 rounded-lg shadow-md my-4" dir="rtl">
    <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-xl font-bold text-amber-400 mb-1">مُحرك التقييم الائتماني التلقائي للعملاء (Automated Credit Scoring)</h2>
            <p className="text-sm text-gray-400">تحليل سلوك السداد للعملاء المستخرج من نظام الـ ERP وتحديد التصنيف الائتماني وتوصيات سقوف البيع الآجل.</p>
        </div>
        <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded text-xs font-semibold border border-amber-500/20">نشط ومتصل بالـ ERP</span>
    </div>
    
    <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-[#1e1e1e] rounded-md overflow-hidden text-right">
            <thead>
                <tr className="bg-[#333] text-amber-400">
                    <th className="p-3">رقم العميل</th>
                    <th className="p-3">اسم العميل / الشركة</th>
                    <th className="p-3">إجمالي الذمم (SAR)</th>
                    <th className="p-3">متوسط أيام التحصيل (DSO)</th>
                    <th className="p-3">نسبة الالتزام (CPR)</th>
                    <th className="p-3">التصنيف الائتماني</th>
                    <th className="p-3">الإجراء والتوصية الآلية</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                    <td className="p-3">1042</td>
                    <td className="p-3 font-medium">شركة الأفق لتجارة التجزئة</td>
                    <td className="p-3">$45,000</td>
                    <td className="p-3">28 يوم</td>
                    <td className="p-3 text-green-400">94%</td>
                    <td className="p-3"><span className="px-2 py-1 rounded text-white font-bold bg-green-700">A</span></td>
                    <td className="p-3 text-gray-300">السماح بزيادة السقف الائتماني بنسبة 20%</td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                    <td className="p-3">1088</td>
                    <td className="p-3 font-medium">مؤسسة النور للمقاولات</td>
                    <td className="p-3">$82,000</td>
                    <td className="p-3">45 يوم</td>
                    <td className="p-3 text-blue-400">80%</td>
                    <td className="p-3"><span className="px-2 py-1 rounded text-white font-bold bg-blue-700">B</span></td>
                    <td className="p-3 text-gray-300">الحفاظ على السقف الائتماني الحالي</td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                    <td className="p-3">1105</td>
                    <td className="p-3 font-medium">النبلاء للخدمات التجريبية</td>
                    <td className="p-3">$64,000</td>
                    <td className="p-3">68 يوم</td>
                    <td className="p-3 text-orange-400">62%</td>
                    <td className="p-3"><span className="px-2 py-1 rounded text-white font-bold bg-orange-600">C</span></td>
                    <td className="p-3 text-gray-300">تقييد المبيعات النقدية واشتراط سداد الدفعة السابقة</td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                    <td className="p-3">1150</td>
                    <td className="p-3 font-medium">شركة الخليج الحديثة</td>
                    <td className="p-3">$120,000</td>
                    <td className="p-3">95 يوم</td>
                    <td className="p-3 text-red-400">42%</td>
                    <td className="p-3"><span className="px-2 py-1 rounded text-white font-bold bg-red-700">D</span></td>
                    <td className="p-3 text-gray-300">إيقاف فوري للبيع الآجل وتحويل الملف للتحصيل القانوني</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>