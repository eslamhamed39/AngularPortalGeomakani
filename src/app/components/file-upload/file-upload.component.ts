import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import * as shapefile from 'shapefile';
import * as toGeoJSON from '@mapbox/togeojson';
import * as tt from '@tomtom-international/web-sdk-maps';

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

  uploadedLayers: LayerInfo[] = [];
  isUploading = false;
  isDragover = false;
  supportedFormats = '.shp,.dbf,.kml,.kmz';
  
  private colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#E74C3C', '#2ECC71', '#3498DB', '#F39C12', '#9B59B6',
    '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#8E44AD'
  ];
  private colorIndex = 0;

  constructor() {}

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length === 0) return;

    this.isUploading = true;
    this.processFiles(files);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragover = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.isUploading = true;
      this.processFiles(files);
    }
  }

  private async processFiles(files: FileList): Promise<void> {
    try {
      const fileArray = Array.from(files);
      const fileNames = fileArray.map(f => f.name.toLowerCase());

      // Determine file type
      if (fileNames.some(name => name.endsWith('.kml') || name.endsWith('.kmz'))) {
        await this.processKMLFile(files);
      } else if (fileNames.some(name => name.endsWith('.shp'))) {
        await this.processShapefile(files);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('An error occurred while processing the file. Please ensure the file is valid.');
    } finally {
      this.isUploading = false;
      this.fileInput.nativeElement.value = '';
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
      const layerInfo = this.createLayerInfo(geojson, kmlFile.name, 'kml');
      this.uploadedLayers.push(layerInfo);
      this.layerAdded.emit(layerInfo);
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
      throw new Error('Error reading Shapefile');
    }

    if (geojson.features.length > 0) {
      const layerInfo = this.createLayerInfo(geojson, shpFile.name, 'shapefile');
      this.uploadedLayers.push(layerInfo);
      this.layerAdded.emit(layerInfo);
    }
  }

  private createLayerInfo(geojson: any, fileName: string, type: 'shapefile' | 'kml'): LayerInfo {
    const layerId = `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const name = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
    
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
    this.uploadedLayers = this.uploadedLayers.filter(layer => layer.id !== layerId);
    this.layerRemoved.emit(layerId);
  }

  zoomToLayer(layer: LayerInfo): void {
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