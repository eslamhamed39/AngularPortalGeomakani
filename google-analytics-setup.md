# إضافة Google Analytics 4 لمشروع Angular

## الخطوات المطلوبة

### 1. الحصول على Google Analytics Measurement ID
- اذهب إلى [Google Analytics](https://analytics.google.com/)
- أنشئ Property جديد (GA4)
- احصل على الـ Measurement ID بالشكل `G-XXXXXXX`

### 2. إضافة كود gtag في index.html
افتح ملف `src/index.html` وأضف الكود التالي داخل `<head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());

  // عطّل الإرسال التلقائي للـ page_view في الـ SPA
  gtag('config', 'G-XXXXXXX', { send_page_view: false });
</script>
```

**ملاحظة:** استبدل `G-XXXXXXX` بالـ Measurement ID الخاص بك.

### 3. إضافة الـ ID في ملفات البيئة

#### في `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  gaMeasurementId: '' // اتركه فارغ في بيئة التطوير
};
```

#### في `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  gaMeasurementId: 'G-XXXXXXX' // ضع الـ ID هنا
};
```

### 4. إضافة تتبع الصفحات في app.component.ts

افتح `src/app/app.component.ts` وأضف الكود التالي:

```typescript
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

declare const gtag: (...args: unknown[]) => void;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!environment.gaMeasurementId) {
      return; // لا ترسل أي أحداث في بيئة التطوير
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        gtag('event', 'page_view', {
          page_path: url
        });
      });
  }
}
```

### 5. اختبار التطبيق

#### للاختبار في بيئة الإنتاج:
```bash
npm run build -- --configuration production
```

#### للاختبار المحلي:
- استخدم سيرفر محلي لعرض ملفات `dist`
- أو انشر على سيرفر حقيقي

### 6. التحقق من عمل Google Analytics

1. افتح الموقع في المتصفح
2. اذهب إلى Google Analytics > Realtime
3. يجب أن ترى الزيارات في الوقت الفعلي
4. في DevTools > Network ابحث عن `collect` أو `gtag/js` للتأكد من الإرسال

## ملاحظات مهمة

- ✅ Google Analytics سيعمل فقط في بيئة الإنتاج
- ✅ في بيئة التطوير لن يتم إرسال أي بيانات
- ✅ يتم تتبع تغيير الصفحات تلقائياً في SPA
- ✅ الكود متوافق مع Angular 17 وأحدث

## استكشاف الأخطاء

إذا لم يعمل Google Analytics:
1. تأكد من صحة الـ Measurement ID
2. تحقق من أن الكود موجود في `index.html`
3. تأكد من أن `environment.prod.ts` يحتوي على الـ ID
4. تحقق من Console في المتصفح للأخطاء
5. تأكد من أن الموقع يعمل في بيئة الإنتاج

---

**تم إنشاء هذا الملف بواسطة AI Assistant**
**تاريخ الإنشاء:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
