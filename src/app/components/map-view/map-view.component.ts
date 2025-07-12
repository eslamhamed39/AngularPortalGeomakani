import { MapControlService } from '../../services/map-control.service';
import { Subscription } from 'rxjs';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, EventEmitter, Output } from '@angular/core';
import * as tt from '@tomtom-international/web-sdk-maps';
import { HttpClient } from '@angular/common/http';
// import ttNavigationControl from '@tomtom-international/web-sdk-maps/plugins/navigation-control/navigation-control';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ttmap', { static: true }) mapDiv!: ElementRef<HTMLDivElement>;
  @Output() polygonSelected = new EventEmitter<{ layer: string }>();
  @Output() mapLoaded = new EventEmitter<void>();
  private mapSub!: Subscription;
  private map: tt.Map | undefined;
  private TT_API_KEY = 'YZlbkr2ee2sbGy3dZsWG85VE4mPsibyQ'; // غيّر بمفتاحك إن أردت
  // private TT_API_KEY = ''; // غيّر بمفتاحك إن أردت

  private defaultCenter: [number, number] = [21.667170602629522, 4.012114320491342];
  private defaultZoom = 2.2;
  private mapIsLoaded: boolean = false;

  // متغيرات لتخزين البيانات من ملفات JSON
  private layerID_use: string[] = [];
  private flyToConfig: Record<string, { center: [number, number], zoom: number, pitch: number }> = {};
  private popupLayers: string[] = [];
  private hoverLayers: string[] = [];

  constructor(private http: HttpClient , private mapControl: MapControlService) { }

  ngAfterViewInit(): void {
    // تحميل البيانات من ملفات JSON أولاً
    this.loadConfigurationData().then(() => {
      this.initializeMap();
    });
  }

  // تحميل البيانات من ملفات JSON
  private async loadConfigurationData(): Promise<void> {
    try {
      const [supportedLayers, flyToConfig, popupLayers, hoverLayers] = await Promise.all([
        this.http.get<string[]>('assets/Layer/supportedLayers.json').toPromise(),
        this.http.get<Record<string, { center: [number, number], zoom: number, pitch: number }>>('assets/Layer/flyToConfig.json').toPromise(),
        this.http.get<string[]>('assets/Layer/popupLayers.json').toPromise(),
        this.http.get<string[]>('assets/Layer/hoverLayers.json').toPromise()
      ]);

      this.layerID_use = supportedLayers || [];
      this.flyToConfig = flyToConfig || {};
      this.popupLayers = popupLayers || [];
      this.hoverLayers = hoverLayers || [];
    } catch (error) {
      console.error('Error loading configuration data:', error);
      // استخدام البيانات الافتراضية في حالة الخطأ
      this.loadDefaultConfiguration();
    }
  }

  // تحميل البيانات الافتراضية في حالة فشل تحميل ملفات JSON
  private loadDefaultConfiguration(): void {
    this.layerID_use = [
      "Project", "Project_outline", "Forest_Logging_Detection", "Forest_Logging_Detection_outline",
      "Land_Cover", "Land_Cover_outline", "Squatters_Camps", "Squatters_Camps_outline",
      "Land_Use", "Land_Use_outline", "Azuri_Towers_Nigeria", "Azuri_Towers_Nigeria_outline",
      "TATU_CITY_KENYA", "TATU_CITY_KENYA_outline", "Crop_Classification", "Crop_Classification_outline",
      "Mining_Monitoring", "Mining_Monitoring_outline", "Oil_Spill_Detection", "Oil_Spill_Detection_outline",
      "Wildfires", "Wildfires_outline", "Crop_Disease_Detection", "Crop_Disease_Detection_outline",
      "Crop_Health", "Crop_Health_outline", "Infrastructure_project", "Infrastructure_project_outline",
      "Libya_Flooding", "Libya_Flooding_outline", "khartoum_airport", "khartoum_airport_outline",
      "Renaissance_Dam", "Renaissance_Dam_outline", "Sudan_Border", "Sudan_Border_outline",
      "Dumyat", "Dumyat_outline", "Cahnge_Detection_Cairo", "Cahnge_Detection_Cairo_outline",
      "Ain_Sokhna_Port", "Ain_Sokhna_Port_outline", "Detect_rice_straw_burning", "Detect_rice_straw_burning_outline",
      "1", "1_outline", "2", "2_outline", "3", "3_outline", "4", "4_outline", "5", "5_outline",
      "6", "6_outline", "7", "7_outline", "8", "8_outline", "9", "9_outline", "10", "10_outline"
    ];

    this.flyToConfig = {
      'Home': { center: [21.667170602629522, 4.012114320491342], zoom: 2.2, pitch: 0 },
      'Forest_Logging_Detection': { center: [25.13647, 0.47325], zoom: 13, pitch: 45 },
      'Land_Cover': { center: [-5.6402, 35.2132], zoom: 9, pitch: 45 },
      'Project': { center: [39.2022738, -6.6880111], zoom: 16, pitch: 45 },
      'Land_Use': { center: [16.415, 27.525], zoom: 4.8, pitch: 45 },
      'Squatters_Camps': { center: [31.0187547, -29.8457573], zoom: 18, pitch: 45 },
      'Azuri_Towers_Nigeria': { center: [3.4063485, 6.4027519], zoom: 16.9, pitch: 45 },
      'TATU_CITY_KENYA': { center: [36.8897801, -1.1556409], zoom: 16, pitch: 45 },
      'Crop_Classification': { center: [37.934, 0.927], zoom: 5.5, pitch: 45 },
      'Mining_Monitoring': { center: [39.379219, -7.161839], zoom: 15, pitch: 45 },
      'Oil_Spill_Detection': { center: [32.21209, 31.50670], zoom: 8.5, pitch: 45 },
      'Wildfires': { center: [4.82700, 36.69667], zoom: 9, pitch: 45 },
      'Crop_Disease_Detection': { center: [35.25887, -0.38983], zoom: 13, pitch: 45 },
      'Crop_Health': { center: [36.05687, -0.23038], zoom: 13, pitch: 45 },
      'Infrastructure_project': { center: [3.9154647, 8.1104762], zoom: 14, pitch: 45 },
      'Libya_Flooding': { center: [22.638857, 32.758258], zoom: 14, pitch: 45 },
      'khartoum_airport': { center: [32.552265, 15.591284], zoom: 13, pitch: 45 },
      'Renaissance_Dam': { center: [35.089010, 11.214324], zoom: 13.5, pitch: 45 },
      'Sudan_Border': { center: [31.152342, 21.999103], zoom: 13.5, pitch: 45 },
      'Dumyat': { center: [31.7461, 31.4020], zoom: 8.9, pitch: 45 },
      'Cahnge_Detection_Cairo': { center: [31.6104, 29.9992], zoom: 8.9, pitch: 45 },
      'Ain_Sokhna_Port': { center: [32.34167, 29.64314], zoom: 11, pitch: 45 },
      'Detect_rice_straw_burning': { center: [29.698, 27.127], zoom: 4.8, pitch: 45 },
      '1': { center: [43.5904433, 25.3306318], zoom: 18, pitch: 45 },
      '2': { center: [43.4305268, 25.7923515], zoom: 18, pitch: 45 },
      '3': { center: [43.9864454, 25.5295076], zoom: 18, pitch: 45 },
      '4': { center: [43.9764618, 25.5994940], zoom: 18, pitch: 45 },
      '5': { center: [43.9622505, 25.3749770], zoom: 18, pitch: 45 },
      '6': { center: [43.9360850, 25.3633250], zoom: 18, pitch: 45 },
      '7': { center: [43.88081962, 25.46766756], zoom: 18, pitch: 45 },
      '8': { center: [43.3960008, 26.1624580], zoom: 18, pitch: 45 },
      '9': { center: [44.14331397, 26.89133424], zoom: 18, pitch: 45 },
      '10': { center: [44.21888586, 26.68871151], zoom: 18, pitch: 45 },
    };

    this.popupLayers = [
      'Project', 'Forest_Logging_Detection', 'Land_Cover', 'Land_Use', 'Squatters_Camps',
      'Azuri_Towers_Nigeria', 'TATU_CITY_KENYA', 'Crop_Classification', 'Mining_Monitoring',
      'Oil_Spill_Detection', 'Wildfires', 'Crop_Disease_Detection', 'Crop_Health',
      'Infrastructure_project', 'Libya_Flooding', 'khartoum_airport', 'Renaissance_Dam',
      'Sudan_Border', 'Dumyat', 'Cahnge_Detection_Cairo', 'Ain_Sokhna_Port', 'Detect_rice_straw_burning',
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
    ];

    this.hoverLayers = [
      'Land_Cover', 'Land_Use', 'Project', 'Forest_Logging_Detection', 'Squatters_Camps',
      'Azuri_Towers_Nigeria', 'TATU_CITY_KENYA', 'Crop_Classification', 'Mining_Monitoring',
      'Oil_Spill_Detection', 'Wildfires', 'Crop_Disease_Detection', 'Crop_Health',
      'Infrastructure_project', 'Libya_Flooding', 'khartoum_airport', 'Renaissance_Dam',
      'Sudan_Border', 'Dumyat', 'Cahnge_Detection_Cairo', 'Ain_Sokhna_Port', 'Detect_rice_straw_burning',
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
    ];
  }

  // إعداد الخريطة
  private initializeMap(): void {
    // إعداد الخريطة TomTom
    const viewport_height = window.innerHeight;
    const zoom = viewport_height < 620 ? 1.6 : this.defaultZoom;

    this.map = tt.map({
      key: this.TT_API_KEY,
      container: this.mapDiv.nativeElement,
      center: this.defaultCenter,
      zoom: zoom,
      // style: 'https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAVVRVTzI1SHRBR3MxQXRBaDtiYWI4ZjY0Yi1lZDkwLTRjYTEtYTlkYy1mYjcxODIyNzdlMzA=/drafts/0.json'
    });

    // أدوات التحكم
    this.map.addControl(new tt.NavigationControl());

    // استمع لأمر إعادة الخريطة للوضع الافتراضي
    this.mapControl.resetMap$.subscribe(() => {
      this.removeAllSourceLayers();
      this.map!.flyTo({
        center: this.defaultCenter,
        zoom: this.defaultZoom,
        pitch: 0,
        duration: 1000
      } as any);
    });

    this.mapSub = this.mapControl.layer$.subscribe(layerName => {
      // عند استقبال طلب جديد من السايدبار
      this.showGeoJsonLayer(layerName);
      // يمكنك أيضا تطبيق flyTo تلقائياً:
      if (this.flyToConfig[layerName]) {
        const conf = this.flyToConfig[layerName];
        this.map!.flyTo({
          center: conf.center,
          zoom: conf.zoom,
          pitch: conf.pitch,
          duration: 3000
        } as any); // Type assertion to bypass linter error for duration
      }
    });
    

    // جعل المؤشر pointer عند المرور على طبقة
    this.layerID_use.forEach(layerId => this.setCursor(layerId));

    // إضافة Hover effect (ألوان) على الطبقات
    this.hoverLayers.forEach(layerId => this.addHoverEffect(layerId));

    // إضافة أحداث الفلاي تو لكل طبقة
    Object.entries(this.flyToConfig).forEach(([id, conf]) => {
      this.map!.on('click', id, () => {
        this.map!.flyTo({
          center: conf.center,
          zoom: conf.zoom,
          pitch: conf.pitch,
          duration: 3000
        } as any); // Type assertion to bypass linter error for duration
      });
    });

    // إضافة أحداث النقر للطبقات مع popup
    this.popupLayers.forEach((layerName: string) => {
      this.map!.on('click', layerName, (e: any) => {
        this.polygonSelected.emit({ layer: layerName });
      });
    });

    // عند تحميل الخريطة أضف أي إعدادات إضافية:
    this.map.on('load', () => {
      this.mapIsLoaded = true;
      this.mapLoaded.emit();
      // مثال: تحميل طبقة مبدئية
      // this.showGeoJsonLayer('Project');
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
    if (this.mapSub) this.mapSub.unsubscribe();
  }

  // تحميل طبقة GeoJSON من مجلد assets/Layer/
  showGeoJsonLayer(layerID: string): void {
    if (!this.map || !this.mapIsLoaded) return;
    this.removeAllSourceLayers();
    Promise.all([
      this.http.get(`assets/Layer/${layerID}.json`).toPromise(),
      this.http.get(`assets/Layer/${layerID}_outline.json`).toPromise()
    ]).then(([layer, outline]: [any, any]) => {
      this.map!.addLayer(layer);
      this.map!.addLayer(outline);
    });
  }

  // إزالة جميع الطبقات المخصصة من الخريطة
  removeAllSourceLayers(): void {
    if (!this.map || !this.mapIsLoaded) return;
    const style = this.map.getStyle();
    if (!style || !style.layers) return;
    style.layers.forEach((layer: any) => {
      const layerId = layer.id;
      if (layer.source && this.layerID_use.includes(layerId)) {
        try {
          this.map!.removeLayer(layerId);
          this.map!.removeSource(layer.source);
        } catch (e) { console.error('Error removing layer/source:', e); }
      }
    });
  }

  // مؤشر الماوس pointer عند المرور على الطبقة
  setCursor(layerId: string): void {
    if (!this.map) return;
    this.map.on('mouseenter', layerId, () => {
      this.map!.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', layerId, () => {
      this.map!.getCanvas().style.cursor = '';
    });
  }

  // تأثير hover (تغيير الألوان) على الطبقة
  addHoverEffect(layerId: string): void {
    if (!this.map) return;
    this.map.on('mouseenter', layerId, () => {
      try {
        this.map!.setPaintProperty(layerId, 'fill-color', '#b8cdff');
        this.map!.setPaintProperty(layerId + '_outline', 'line-color', '#182ead');
      } catch { }
    });
    this.map.on('mouseleave', layerId, () => {
      try {
        this.map!.setPaintProperty(layerId, 'fill-color', '#216bc0');
        this.map!.setPaintProperty(layerId + '_outline', 'line-color', '#fff');
      } catch { }
    });
  }

  // لإظهار طبقة جديدة عند اختيار من القائمة الجانبية، نادِ:
  // this.showGeoJsonLayer('اسم_الطبقة');
}
