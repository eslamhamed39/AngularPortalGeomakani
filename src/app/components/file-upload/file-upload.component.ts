import { Component, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import * as shapefile from 'shapefile';
import * as toGeoJSON from '@mapbox/togeojson';
import * as tt from '@tomtom-international/web-sdk-maps';
import { MapViewComponent } from '../map-view/map-view.component';
import { BootstrapToastService } from '../../services/bootstrap-toast.service';

export interface LayerInfo {
  id: string;
  name: string;
  type: 'shapefile' | 'kml';
  area: number; // in square kilometers
  perimeter: number; // in kilometers
  center: [number, number];
  geojson: any;
  color: string;
  areaUnit?: 'km' | 'm' | 'ha';
  perimeterUnit?: 'km' | 'm';
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() layerAdded = new EventEmitter<LayerInfo>();
  @Output() layerRemoved = new EventEmitter<string>();
  @Output() layerZoomRequested = new EventEmitter<LayerInfo>();
  @Output() showAllLayersRequested = new EventEmitter<void>();
  @Input() mapView?: MapViewComponent;

  uploadedLayers: LayerInfo[] = [];
  originalLayers: LayerInfo[] = []; // Store original layers before filtering
  isUploading = false;
  isDragover = false;
  supportedFormats = '.shp,.kml,.kmz,.geojson';
  
  private colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#E74C3C', '#2ECC71', '#3498DB', '#F39C12', '#9B59B6',
    '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#8E44AD'
  ];
  private colorIndex = 0;

  constructor(private toastService: BootstrapToastService) {}

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length === 0) return;

    // Hide popup when selecting files
    if (this.mapView) {
      this.mapView.closePopup();
    }

    // مسح الطبقات السابقة عند رفع ملفات جديدة
    this.clearAllLayers();

    this.isUploading = true;
    this.processFiles(files);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragover = false;
    
    // Hide popup when dropping files
    if (this.mapView) {
      this.mapView.closePopup();
    }
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      // مسح الطبقات السابقة عند رفع ملفات جديدة
      this.clearAllLayers();
      this.isUploading = true;
      this.processFiles(files);
    }
  }

  private clearAllLayers(): void {
    // مسح جميع الطبقات من الخريطة
    this.uploadedLayers.forEach(layer => {
      this.layerRemoved.emit(layer.id);
    });
    
    // مسح المصفوفات
    this.uploadedLayers = [];
    this.originalLayers = [];
  }

  private async processFiles(files: FileList): Promise<void> {
    try {
      const fileArray = Array.from(files);
      const fileNames = fileArray.map(f => f.name.toLowerCase());

      if (fileNames.some(name => name.endsWith('.kml'))) {
        await this.processKMLFile(files);
        this.toastService.success('KML file uploaded and processed successfully.');
      } else if (fileNames.some(name => name.endsWith('.kmz'))) {
        await this.processKMZFile(files);
        this.toastService.success('KMZ file uploaded and processed successfully.');
      } else if (fileNames.some(name => name.endsWith('.shp'))) {
        await this.processShapefile(files);
        this.toastService.success('Shapefile uploaded and processed successfully.');
      } else if (fileNames.some(name => name.endsWith('.geojson'))) {
        await this.processGeoJSONFile(files);
        this.toastService.success('GeoJSON file uploaded and processed successfully.');
      } else {
        this.toastService.error('Unsupported file type. Please upload a supported file.');
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      this.toastService.error('An error occurred while processing the file. Please check the file or its type.');
    } finally {
      this.isUploading = false;
      this.fileInput.nativeElement.value = '';
    }
  }

  // دعم KMZ (يتطلب jszip)
  private async processKMZFile(files: FileList): Promise<void> {
    const kmzFile = Array.from(files).find(f => f.name.toLowerCase().endsWith('.kmz'));
    if (!kmzFile) throw new Error('KMZ file not found');
    try {
      // dynamic import for jszip
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(await kmzFile.arrayBuffer());
      // ابحث عن أول ملف kml داخل الأرشيف
      let kmlFileName = Object.keys(zip.files).find(name => name.toLowerCase().endsWith('.kml'));
      if (!kmlFileName) throw new Error('No KML file found inside KMZ');
      const kmlText = await zip.files[kmlFileName].async('text');
      // استخدم نفس منطق KML
      await this.processKMLFile({
        0: new File([kmlText], kmlFileName!, { type: 'text/xml' }),
        length: 1,
        item: (i: number) => new File([kmlText], kmlFileName!, { type: 'text/xml' })
      } as unknown as FileList);
    } catch (error) {
      this.toastService.error('Failed to process KMZ file.');
      throw error;
    }
  }

  // دعم GeoJSON
  private async processGeoJSONFile(files: FileList): Promise<void> {
    const geojsonFile = Array.from(files).find(f => f.name.toLowerCase().endsWith('.geojson'));
    if (!geojsonFile) throw new Error('GeoJSON file not found');
    try {
      const text = await geojsonFile.text();
      const geojson = JSON.parse(text);
      if (geojson.features && geojson.features.length > 0) {
        geojson.features.forEach((feature: any, idx: number) => {
          let processedFeature = { ...feature };
          // إذا كان feature من نوع LineString أو MultiLineString، حوله إلى Polygon
          if (feature.geometry && feature.geometry.type === 'LineString') {
            let coords = [...feature.geometry.coordinates];
            if (
              coords.length > 2 &&
              (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])
            ) {
              coords.push([...coords[0]]);
            }
            processedFeature = {
              ...feature,
              geometry: {
                type: 'Polygon',
                coordinates: [coords]
              }
            };
          } else if (feature.geometry && feature.geometry.type === 'MultiLineString') {
            let polygons = feature.geometry.coordinates.map((line: number[][]) => {
              let coords = [...line];
              if (
                coords.length > 2 &&
                (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])
              ) {
                coords.push([...coords[0]]);
              }
              return coords;
            });
            processedFeature = {
              ...feature,
              geometry: {
                type: 'Polygon',
                coordinates: polygons
              }
            };
          }
          const singleFeatureGeoJSON = {
            type: 'FeatureCollection',
            features: [processedFeature]
          };
          const layerName = geojson.features.length > 1 ? `${geojsonFile.name.replace(/\.[^/.]+$/, '')}_part${idx + 1}` : geojsonFile.name.replace(/\.[^/.]+$/, '');
          const layerInfo = this.createLayerInfo(singleFeatureGeoJSON, layerName, 'kml'); // type: 'kml' for now
          if (layerInfo) {
            this.uploadedLayers.push(layerInfo);
            this.originalLayers.push(layerInfo);
            this.layerAdded.emit(layerInfo);
            this.toastService.success(`تم إضافة الطبقة ${layerName} بنجاح.`);
          }
        });
      }
    } catch (error) {
      this.toastService.error('Failed to process GeoJSON file.');
      throw error;
    }
  }

  // دعم GPKG (يتطلب مكتبة خارجية)
  private async processGPKGFile(files: FileList): Promise<void> {
    const gpkgFile = Array.from(files).find(f => f.name.toLowerCase().endsWith('.gpkg'));
    if (!gpkgFile) throw new Error('GPKG file not found');
    try {
      // ملاحظة: يتطلب دعم GPKG مكتبة خارجية مثل @ngageoint/geopackage أو ogr2ogr-js
      // مثال (غير مفعل):
      // const arrayBuffer = await gpkgFile.arrayBuffer();
      // const GeoPackage = (await import('@ngageoint/geopackage')).GeoPackageAPI;
      // const gpkg = await GeoPackage.open(arrayBuffer);
      // const tables = gpkg.getFeatureTables();
      // for (const table of tables) {
      //   const features = await gpkg.iterateGeoJSONFeatures(table);
      //   for await (const feature of features) {
      //     // نفس منطق التقسيم والتحويل
      //   }
      // }
      this.toastService.warning('GPKG support requires an additional library. Please install @ngageoint/geopackage or use a backend service to convert to GeoJSON.');
    } catch (error) {
      this.toastService.error('Failed to process GPKG file.');
      throw error;
    }
  }

  private async processKMLFile(files: FileList): Promise<void> {
    const kmlFile = Array.from(files).find(f => 
      f.name.toLowerCase().endsWith('.kml') || f.name.toLowerCase().endsWith('.kmz')
    );

    if (!kmlFile) throw new Error('KML file not found');

    const text = await kmlFile.text();
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(text, 'text/xml');
    const geojson = toGeoJSON.kml(kmlDoc);

    if (geojson.features && geojson.features.length > 0) {
      geojson.features.forEach((feature: any, idx: number) => {
        let processedFeature = { ...feature };
        // إذا كان feature من نوع LineString أو MultiLineString، حوله إلى Polygon
        if (feature.geometry && feature.geometry.type === 'LineString') {
          let coords = [...feature.geometry.coordinates];
          // إذا لم يكن مغلقًا، أغلقه
          if (
            coords.length > 2 &&
            (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])
          ) {
            coords.push([...coords[0]]);
          }
          processedFeature = {
            ...feature,
            geometry: {
              type: 'Polygon',
              coordinates: [coords]
            }
          };
        } else if (feature.geometry && feature.geometry.type === 'MultiLineString') {
          let polygons = feature.geometry.coordinates.map((line: number[][]) => {
            let coords = [...line];
            if (
              coords.length > 2 &&
              (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])
            ) {
              coords.push([...coords[0]]);
            }
            return coords;
          });
          processedFeature = {
            ...feature,
            geometry: {
              type: 'Polygon',
              coordinates: polygons
            }
          };
        }
        // أنشئ GeoJSON جديد يحتوي فقط على هذا الـ feature (بعد المعالجة)
        const singleFeatureGeoJSON = {
          type: 'FeatureCollection',
          features: [processedFeature]
        };
        // اسم الطبقة: اسم الملف + رقم
        const layerName = geojson.features.length > 1 ? `${kmlFile.name.replace(/\.[^/.]+$/, '')}_part${idx + 1}` : kmlFile.name.replace(/\.[^/.]+$/, '');
        const layerInfo = this.createLayerInfo(singleFeatureGeoJSON, layerName, 'kml');
        if (layerInfo) {
          this.uploadedLayers.push(layerInfo);
          this.originalLayers.push(layerInfo);
          this.layerAdded.emit(layerInfo);
          this.toastService.success(`تم إضافة الطبقة ${layerName} بنجاح.`);
        }
      });
    }
  }

  private async processShapefile(files: FileList): Promise<void> {
    const shpFile = Array.from(files).find(f => f.name.toLowerCase().endsWith('.shp'));
    const dbfFile = Array.from(files).find(f => f.name.toLowerCase().endsWith('.dbf'));

    if (!shpFile) throw new Error('.shp file not found');

    const shpBuffer = await shpFile.arrayBuffer();
    const dbfBuffer = dbfFile ? await dbfFile.arrayBuffer() : undefined;

    const geojson: any = {
      type: 'FeatureCollection',
      features: []
    };

    try {
      const source = await shapefile.open(shpBuffer, dbfBuffer);
      let result;
      while ((result = await source.read()) && !result.done) {
        geojson.features.push(result.value);
      }
    } catch (error) {
      console.error('Error reading Shapefile:', error);
      this.toastService.error('An error occurred while reading the Shapefile. Please check the .shp and .dbf files.');
      throw new Error('Error reading Shapefile');
    }

    if (geojson.features.length > 0) {
      geojson.features.forEach((feature: any, idx: number) => {
        let processedFeature = { ...feature };
        // إذا كان feature من نوع LineString أو MultiLineString، حوله إلى Polygon
        if (feature.geometry && feature.geometry.type === 'LineString') {
          let coords = [...feature.geometry.coordinates];
          // إذا لم يكن مغلقًا، أغلقه
          if (
            coords.length > 2 &&
            (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])
          ) {
            coords.push([...coords[0]]);
          }
          processedFeature = {
            ...feature,
            geometry: {
              type: 'Polygon',
              coordinates: [coords]
            }
          };
        } else if (feature.geometry && feature.geometry.type === 'MultiLineString') {
          let polygons = feature.geometry.coordinates.map((line: number[][]) => {
            let coords = [...line];
            if (
              coords.length > 2 &&
              (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])
            ) {
              coords.push([...coords[0]]);
            }
            return coords;
          });
          processedFeature = {
            ...feature,
            geometry: {
              type: 'Polygon',
              coordinates: polygons
            }
          };
        }
        // أنشئ GeoJSON جديد يحتوي فقط على هذا الـ feature (بعد المعالجة)
        const singleFeatureGeoJSON = {
          type: 'FeatureCollection',
          features: [processedFeature]
        };
        // اسم الطبقة: اسم الملف + رقم
        const layerName = geojson.features.length > 1 ? `${shpFile.name.replace(/\.[^/.]+$/, '')}_part${idx + 1}` : shpFile.name.replace(/\.[^/.]+$/, '');
        const layerInfo = this.createLayerInfo(singleFeatureGeoJSON, layerName, 'shapefile');
        if (layerInfo) {
          this.uploadedLayers.push(layerInfo);
          this.originalLayers.push(layerInfo);
          this.layerAdded.emit(layerInfo);
          this.toastService.success(`تم إضافة الطبقة ${layerName} بنجاح.`);
        }
      });
    }
  }

  private createLayerInfo(geojson: any, fileName: string, type: 'shapefile' | 'kml'): LayerInfo | null {
    const layerId = `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const name = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
    
    // التحقق من صحة الطبقة
    const validationResult = this.validateLayer(geojson, name);
    if (!validationResult.isValid) {
      this.toastService.error(`الطبقة "${name}" غير صالحة: ${validationResult.reason}`);
      return null;
    }
    
    // Calculate area, perimeter, and center
    const { area, perimeter, center } = this.calculateGeometry(geojson);
    
    return {
      id: layerId,
      name: name,
      type: type,
      area: area,
      perimeter: perimeter,
      center: center,
      geojson: geojson,
      color: this.getNextColor(),
      areaUnit: 'km',
      perimeterUnit: 'km'
    };
  }

  private validateLayer(geojson: any, layerName: string): { isValid: boolean; reason?: string } {
    // التحقق من وجود geojson
    if (!geojson) {
      return { isValid: false, reason: 'الملف فارغ أو غير صالح' };
    }

    // التحقق من نوع geojson
    if (geojson.type !== 'FeatureCollection') {
      return { isValid: false, reason: 'نوع الملف غير صحيح (يجب أن يكون FeatureCollection)' };
    }

    // التحقق من وجود features
    if (!geojson.features || !Array.isArray(geojson.features)) {
      return { isValid: false, reason: 'لا توجد ميزات جغرافية في الملف' };
    }

    if (geojson.features.length === 0) {
      return { isValid: false, reason: 'الملف لا يحتوي على أي ميزات جغرافية' };
    }

    // التحقق من كل feature
    for (let i = 0; i < geojson.features.length; i++) {
      const feature = geojson.features[i];
      
      // التحقق من وجود geometry
      if (!feature.geometry) {
        return { isValid: false, reason: `الميزة رقم ${i + 1} لا تحتوي على بيانات هندسية` };
      }

      // التحقق من نوع geometry
      if (!['Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
        return { isValid: false, reason: `نوع الميزة رقم ${i + 1} غير مدعوم (${feature.geometry.type}). الأنواع المدعومة: Polygon, MultiPolygon` };
      }

      // التحقق من وجود coordinates
      if (!feature.geometry.coordinates || !Array.isArray(feature.geometry.coordinates)) {
        return { isValid: false, reason: `الميزة رقم ${i + 1} لا تحتوي على إحداثيات صحيحة` };
      }

      // التحقق من صحة الإحداثيات
      const coordValidation = this.validateCoordinates(feature.geometry);
      if (!coordValidation.isValid) {
        return { isValid: false, reason: `الميزة رقم ${i + 1}: ${coordValidation.reason}` };
      }
    }

    return { isValid: true };
  }

  private validateCoordinates(geometry: any): { isValid: boolean; reason?: string } {
    if (geometry.type === 'Polygon') {
      if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
        return { isValid: false, reason: 'الإحداثيات فارغة' };
      }

      const coords = geometry.coordinates[0];
      if (!Array.isArray(coords) || coords.length < 3) {
        return { isValid: false, reason: 'يجب أن يحتوي المضلع على 3 نقاط على الأقل' };
      }

      // التحقق من صحة الإحداثيات
      for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        if (!Array.isArray(coord) || coord.length < 2) {
          return { isValid: false, reason: `النقطة رقم ${i + 1} لا تحتوي على إحداثيات كافية` };
        }

        const [lng, lat] = coord;
        if (typeof lng !== 'number' || typeof lat !== 'number') {
          return { isValid: false, reason: `النقطة رقم ${i + 1} تحتوي على إحداثيات غير صحيحة` };
        }

        // التحقق من نطاق الإحداثيات
        if (lng < -180 || lng > 180) {
          return { isValid: false, reason: `خط الطول في النقطة رقم ${i + 1} خارج النطاق المسموح (-180 إلى 180)` };
        }

        if (lat < -90 || lat > 90) {
          return { isValid: false, reason: `خط العرض في النقطة رقم ${i + 1} خارج النطاق المسموح (-90 إلى 90)` };
        }
      }

      // التحقق من أن المضلع مغلق
      const firstCoord = coords[0];
      const lastCoord = coords[coords.length - 1];
      if (firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1]) {
        return { isValid: false, reason: 'المضلع غير مغلق (النقطة الأولى والأخيرة يجب أن تكونا متطابقتين)' };
      }

    } else if (geometry.type === 'MultiPolygon') {
      if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
        return { isValid: false, reason: 'الإحداثيات فارغة' };
      }

      for (let i = 0; i < geometry.coordinates.length; i++) {
        const polygon = geometry.coordinates[i];
        if (!Array.isArray(polygon) || polygon.length === 0) {
          return { isValid: false, reason: `المضلع رقم ${i + 1} فارغ` };
        }

        const coords = polygon[0];
        if (!Array.isArray(coords) || coords.length < 3) {
          return { isValid: false, reason: `المضلع رقم ${i + 1} يجب أن يحتوي على 3 نقاط على الأقل` };
        }

        // التحقق من صحة الإحداثيات في كل مضلع
        for (let j = 0; j < coords.length; j++) {
          const coord = coords[j];
          if (!Array.isArray(coord) || coord.length < 2) {
            return { isValid: false, reason: `النقطة رقم ${j + 1} في المضلع رقم ${i + 1} لا تحتوي على إحداثيات كافية` };
          }

          const [lng, lat] = coord;
          if (typeof lng !== 'number' || typeof lat !== 'number') {
            return { isValid: false, reason: `النقطة رقم ${j + 1} في المضلع رقم ${i + 1} تحتوي على إحداثيات غير صحيحة` };
          }

          // التحقق من نطاق الإحداثيات
          if (lng < -180 || lng > 180) {
            return { isValid: false, reason: `خط الطول في النقطة رقم ${j + 1} في المضلع رقم ${i + 1} خارج النطاق المسموح (-180 إلى 180)` };
          }

          if (lat < -90 || lat > 90) {
            return { isValid: false, reason: `خط العرض في النقطة رقم ${j + 1} في المضلع رقم ${i + 1} خارج النطاق المسموح (-90 إلى 90)` };
          }
        }

        // التحقق من أن المضلع مغلق
        const firstCoord = coords[0];
        const lastCoord = coords[coords.length - 1];
        if (firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1]) {
          return { isValid: false, reason: `المضلع رقم ${i + 1} غير مغلق (النقطة الأولى والأخيرة يجب أن تكونا متطابقتين)` };
        }
      }
    }

    return { isValid: true };
  }

  private calculateGeometry(geojson: any): { area: number, perimeter: number, center: [number, number] } {
    let totalArea = 0;
    let totalPerimeter = 0;
    let totalCenterX = 0;
    let totalCenterY = 0;
    let featureCount = 0;

    geojson.features.forEach((feature: any) => {
      if (feature.geometry.type === 'Polygon') {
        const coords = feature.geometry.coordinates[0];
        const area = this.calculatePolygonArea(coords);
        const perimeter = this.calculatePolygonPerimeter(coords);
        const center = this.calculatePolygonCenter(coords);

        totalArea += area;
        totalPerimeter += perimeter;
        totalCenterX += center[0];
        totalCenterY += center[1];
        featureCount++;
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon: number[][][]) => {
          const coords = polygon[0];
          const area = this.calculatePolygonArea(coords);
          const perimeter = this.calculatePolygonPerimeter(coords);
          const center = this.calculatePolygonCenter(coords);

          totalArea += area;
          totalPerimeter += perimeter;
          totalCenterX += center[0];
          totalCenterY += center[1];
          featureCount++;
        });
      }
    });

    return {
      area: totalArea,
      perimeter: totalPerimeter,
      center: featureCount > 0 ? [totalCenterX / featureCount, totalCenterY / featureCount] : [0, 0]
    };
  }

  private calculatePolygonArea(coordinates: number[][]): number {
    // Calculate area using polygon area formula
    let area = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    area = Math.abs(area) / 2;
    
    // Convert from degrees to square kilometers (approximate)
    // This is a simple approximation, for better accuracy use a library like turf.js
    return area * 111.32 * 111.32 * Math.cos(coordinates[0][1] * Math.PI / 180);
  }

  private calculatePolygonPerimeter(coordinates: number[][]): number {
    let perimeter = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const dx = coordinates[j][0] - coordinates[i][0];
      const dy = coordinates[j][1] - coordinates[i][1];
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    
    // Convert from degrees to kilometers (approximate)
    return perimeter * 111.32;
  }

  private calculatePolygonCenter(coordinates: number[][]): [number, number] {
    let centerX = 0;
    let centerY = 0;
    
    coordinates.forEach(coord => {
      centerX += coord[0];
      centerY += coord[1];
    });
    
    return [centerX / coordinates.length, centerY / coordinates.length];
  }

  private getNextColor(): string {
    const color = this.colorPalette[this.colorIndex % this.colorPalette.length];
    this.colorIndex++;
    return color;
  }

  removeLayer(layerId: string): void {
    // Hide popup when removing layers
    if (this.mapView) {
      this.mapView.closePopup();
    }
    
    const removedLayer = this.uploadedLayers.find(layer => layer.id === layerId);
    this.uploadedLayers = this.uploadedLayers.filter(layer => layer.id !== layerId);
    // لا نحذف من originalLayers عند الحذف اليدوي - نحتفظ بها للاستعادة
    this.layerRemoved.emit(layerId);
    if (removedLayer) {
      this.toastService.success(`تم حذف الطبقة ${removedLayer.name} بنجاح.`);
    }
  }

  zoomToLayer(layer: LayerInfo): void {
    // Hide popup when zooming to layers
    if (this.mapView) {
      this.mapView.closePopup();
    }
    
    console.log('Current layers before filter:', this.uploadedLayers.map(l => ({ name: l.name, center: l.center })));
    console.log('Target layer:', { name: layer.name, center: layer.center });
    
    // احفظ الترتيب الأصلي
    const originalOrder = [...this.uploadedLayers];
    
    // احذف جميع الطبقات الموجودة من الخريطة أولاً
    this.uploadedLayers.forEach(existingLayer => {
      this.layerRemoved.emit(existingLayer.id);
    });
    
    // احذف الطبقة إذا كانت موجودة (بالاسم أو إحداثيات المركز)
    this.uploadedLayers = this.uploadedLayers.filter(l => 
      l.name !== layer.name && !this.coordinatesMatch(l.center, layer.center)
    );
    
    console.log('Layers after filter:', this.uploadedLayers.length);
    
    // أنشئ نسخة جديدة مع id جديد
    const newLayer = { ...layer, id: `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };

    // أضف الطبقة الجديدة في نفس موقع الطبقة القديمة
    const oldIndex = originalOrder.findIndex(l => 
      l.name === layer.name || this.coordinatesMatch(l.center, layer.center)
    );
    
    if (oldIndex >= 0) {
      this.uploadedLayers.splice(oldIndex, 0, newLayer);
    } else {
      this.uploadedLayers.push(newLayer);
    }

    this.layerAdded.emit(newLayer);
    this.layerZoomRequested.emit(newLayer);
  }

  showAllLayers(): void {
    // Hide popup when showing all layers
    if (this.mapView) {
      this.mapView.closePopup();
    }
    
    // التحقق من وجود طبقات أصلية
    if (this.originalLayers.length === 0) {
      this.toastService.warning('لا توجد طبقات للاستعادة. يرجى رفع ملفات جديدة.');
      return;
    }
    
    // Remove all current layers from map
    this.uploadedLayers.forEach(layer => {
      this.layerRemoved.emit(layer.id);
    });
    
    // Restore all original layers
    this.uploadedLayers = [...this.originalLayers];
    
    // Add all layers back to map
    this.uploadedLayers.forEach(layer => {
      this.layerAdded.emit(layer);
    });
    
    // Emit event to show all layers
    this.showAllLayersRequested.emit();
    
    this.toastService.success('تم استعادة جميع الطبقات بنجاح.');
  }

  clearAllUploadedLayers(): void {
    // Hide popup when clearing layers
    if (this.mapView) {
      this.mapView.closePopup();
    }
    
    // التحقق من وجود طبقات للمسح
    if (this.uploadedLayers.length === 0 && this.originalLayers.length === 0) {
      this.toastService.warning('لا توجد طبقات للمسح.');
      return;
    }
    
    // Remove all layers from map
    this.uploadedLayers.forEach(layer => {
      this.layerRemoved.emit(layer.id);
    });
    
    // Clear all arrays
    this.uploadedLayers = [];
    this.originalLayers = [];
    
    this.toastService.success('تم مسح جميع الطبقات بنجاح.');
  }

  // دالة مساعدة لمقارنة الإحداثيات
  private coordinatesMatch(coord1: [number, number], coord2: [number, number]): boolean {
    const tolerance = 0.000001; // تحمل صغير للفروق العشرية
    return Math.abs(coord1[0] - coord2[0]) < tolerance && 
           Math.abs(coord1[1] - coord2[1]) < tolerance;
  }

  toggleAreaUnit(layerId: string, unit: 'km' | 'm' | 'ha'): void {
    const layer = this.uploadedLayers.find(l => l.id === layerId);
    if (layer) {
      layer.areaUnit = unit;
    }
  }

  togglePerimeterUnit(layerId: string, unit: 'km' | 'm'): void {
    const layer = this.uploadedLayers.find(l => l.id === layerId);
    if (layer) {
      layer.perimeterUnit = unit;
    }
  }

  formatArea(area: number, unit: 'km' | 'm' | 'ha' = 'km'): string {
    switch (unit) {
      case 'km':
        return `${area.toFixed(2)} km²`;
      case 'm':
        return `${(area * 1000000).toFixed(2)} m²`;
      case 'ha':
        return `${(area * 100).toFixed(2)} ha`;
      default:
        return `${area.toFixed(2)} km²`;
    }
  }

  formatPerimeter(perimeter: number, unit: 'km' | 'm' = 'km'): string {
    switch (unit) {
      case 'km':
        return `${perimeter.toFixed(2)} km`;
      case 'm':
        return `${(perimeter * 1000).toFixed(2)} m`;
      default:
        return `${perimeter.toFixed(2)} km`;
    }
  }
} 