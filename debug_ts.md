# تشخيص أخطاء TypeScript المستعصية — آخر حالة

## المشكلة
12 خطأ في Home.tsx: "Property 'X' does not exist on type 'TRPCContextPropsBase<BuiltRouter<...system...auth...>>'" — TypeScript يرى AppRouter بمفاتيح system و auth فقط رغم أن server/routers.ts يحتوي saeis: saeisRouter (تم التحقق بـ grep).

## ما تم التحقق منه
- server/routers.ts يحتوي: `import { saeisRouter } from "./saeisRouter";` و `saeis: saeisRouter,` — صحيح.
- server/saeisRouter.ts: يصدر saeisRouter بـ router() من "./_core/trpc" — صحيح.
- client/src/lib/trpc.ts: `import type { AppRouter } from "../../../server/routers";` و `createTRPCReact<AppRouter>()` — مسار صحيح (lib → ../../../server/routers).
- لا يوجد dist/routers.d.ts ولا server/routers.d.ts (حذفت dist).
- server/index.ts لا يعيد تصدير appRouter؛ server/_core/index.ts يستورد من "../routers".
- tsconfig: include يحتوي server/**/*، paths: @/* و @shared/*.
- حذف tsbuildinfo وأعيد fsc — لا تغيير.
- أخطاء Home فقط (101-123, 308, 316) — alertCount حُلّ، المتبقي كل trpc.saeis.*.

## فرضية جديدة مهمة
رسالة الخطأ تعرض type مقطوعة "...system...auth... s..." — المقطع الأخير "s..." قد يكون بداية saeis لكن TS يقص العرض. أي أن الخطأ ربما ليس في رؤية المفاتيح! الأخطاء TS2339 على `trpc.saeis.dashboard` تشير إلى أن TS يرى trpc نفسه من AppRouter قديم.

## الحل التالي المقترح
تغيير استيراد AppRouter في trpc.ts إلى المسار المطلق الآلي:
`import type { AppRouter } from "@/../server/routers";`
وإذا فشل: التحقق من أن التتبع الكامل: Home تستورد trpc من "@/lib/trpc" وtrpc تستورد من "../../../server/routers". المسافة: client/src/lib/ ← server/routers = ../../server/routers (وليس ../../../)!
**خطأ فعلي**: lib/trpc.ts في client/src/lib/، و "../../../server/routers" = client/src/../../../server/routers → خارج المشروع! المسار الصحيح هو "../../server/routers".
لكن... هذا الملف مولّد آليًا من القالب ويعمل لقراءة system/auth! "../../server/routers" من client/src/lib = client/server — غير موجود. الصحيح: client/src/lib/trpc.ts → ../ = client/src, ../../ = client, ../../../ = المشروع, ../../../server/routers = server/routers ✓ المسار صحيح.

## ملاحظة أخيرة
إذا استمر الفشل رغم صحة كل المسارات، قد يكون هناك نسخة من server/routers.ts في cache أو أن التسمية في saeisRouter.ts تُصدَّر باسم مختلف (default export). التحقق: grep "export const saeisRouter" server/saeisRouter.ts + "export { saeisRouter }".
