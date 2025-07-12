# ملفات إعدادات الطبقات (Layer Configuration Files)

هذا المجلد يحتوي على ملفات JSON التي تحكم سلوك الطبقات في الخريطة.

## الملفات الجديدة

### 1. `flyToConfig.json`
يحتوي على إعدادات الانتقال (flyTo) لكل طبقة:
- `center`: إحداثيات المركز [longitude, latitude]
- `zoom`: مستوى التكبير
- `pitch`: زاوية الميل

### 2. `supportedLayers.json`
قائمة بأسماء جميع الطبقات المدعومة في النظام، بما في ذلك الطبقات الأساسية والحدودية (_outline).

### 3. `popupLayers.json`
قائمة بالطبقات التي تدعم النقر لإظهار popup.

### 4. `hoverLayers.json`
قائمة بالطبقات التي تدعم تأثير hover (تغيير الألوان عند المرور بالمؤشر).

## الملفات الموجودة مسبقاً

### `layersConfig.json`
يحتوي على إعدادات مفصلة لكل طبقة مثل:
- الصور والرسوم البيانية
- الروابط الإخبارية
- إعدادات العرض
- التواريخ

### ملفات GeoJSON
كل طبقة لها ملفين:
- `{layerName}.json`: البيانات الأساسية للطبقة
- `{layerName}_outline.json`: حدود الطبقة

## كيفية الاستخدام

في الكود، يتم تحميل هذه الملفات تلقائياً عند بدء تشغيل المكون:

```typescript
// تحميل البيانات من ملفات JSON
private async loadConfigurationData(): Promise<void> {
  const [supportedLayers, flyToConfig, popupLayers, hoverLayers] = await Promise.all([
    this.http.get<string[]>('assets/Layer/supportedLayers.json').toPromise(),
    this.http.get<Record<string, { center: [number, number], zoom: number, pitch: number }>>('assets/Layer/flyToConfig.json').toPromise(),
    this.http.get<string[]>('assets/Layer/popupLayers.json').toPromise(),
    this.http.get<string[]>('assets/Layer/hoverLayers.json').toPromise()
  ]);
}
```

## المزايا

1. **سهولة الصيانة**: يمكن تعديل الإعدادات بدون تغيير الكود
2. **المرونة**: إضافة طبقات جديدة يتطلب فقط تحديث ملفات JSON
3. **الأمان**: البيانات الافتراضية محفوظة في حالة فشل تحميل الملفات
4. **التنظيم**: فصل البيانات عن المنطق البرمجي

## إضافة طبقة جديدة

لإضافة طبقة جديدة:

1. أضف ملفي GeoJSON: `{layerName}.json` و `{layerName}_outline.json`
2. أضف اسم الطبقة إلى `supportedLayers.json`
3. أضف إعدادات flyTo إلى `flyToConfig.json`
4. أضف إلى `popupLayers.json` إذا كانت تدعم النقر
5. أضف إلى `hoverLayers.json` إذا كانت تدعم hover effect
6. أضف إعدادات مفصلة إلى `layersConfig.json` إذا لزم الأمر 