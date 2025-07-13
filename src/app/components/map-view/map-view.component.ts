import { MapControlService } from '../../services/map-control.service';
import { Subscription } from 'rxjs';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as tt from '@tomtom-international/web-sdk-maps';
import { HttpClient } from '@angular/common/http';
import { LayerInfo } from '../file-upload/file-upload.component';
// import ttNavigationControl from '@tomtom-international/web-sdk-maps/plugins/navigation-control/navigation-control';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('ttmap', { static: true }) mapDiv!: ElementRef<HTMLDivElement>;
  @Output() polygonSelected = new EventEmitter<{ layer: string }>();
  @Output() mapLoaded = new EventEmitter<void>();
  @Input() uploadedLayers: LayerInfo[] = [];
  
  private mapSub!: Subscription;
  private map: tt.Map | undefined;
  private TT_API_KEY = 'YZlbkr2ee2sbGy3dZsWG85VE4mPsibyQ'; // Change with your key if needed
  // private TT_API_KEY = ''; // Change with your key if needed

  private defaultCenter: [number, number] = [21.667170602629522, 4.012114320491342];
  private defaultZoom = 2.2;
  private mapIsLoaded: boolean = false;

  // Settings for centering uploaded layers
  private centerOffset = {
    longitude: -0.05, // Move center east (right) - positive value for east, negative for west
    latitude: 0       // Move center north (up) - positive value for north, negative for south
  };

  // Variables to store data from JSON files
  private layerID_use: string[] = [];
  private flyToConfig: Record<string, { center: [number, number], zoom: number, pitch: number }> = {};
  private popupLayers: string[] = [];
  private hoverLayers: string[] = [];

  // Variables for uploaded layers
  private uploadedLayerSources: Map<string, any> = new Map();
  private popup: tt.Popup | undefined;
  private previousUploadedLayers: LayerInfo[] = [];
  
  // Add queue for pending layers
  private pendingLayers: LayerInfo[] = [];

  constructor(private http: HttpClient , private mapControl: MapControlService) { }

  ngAfterViewInit(): void {
    // Load data from JSON files first
    this.loadConfigurationData().then(() => {
      this.initializeMap();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['uploadedLayers']) {
      if (this.map && this.mapIsLoaded) {
        this.handleUploadedLayersChange();
      } else if (this.uploadedLayers.length > 0) {
        // If map is not loaded yet, add layers to pending queue
        this.uploadedLayers.forEach(layer => {
          const existingPendingLayer = this.pendingLayers.find(l => l.id === layer.id);
          if (!existingPendingLayer) {
            this.pendingLayers.push(layer);
          }
        });
      }
    }
  }

  // Handle changes in uploaded layers
  private handleUploadedLayersChange(): void {
    // Remove layers that no longer exist
    this.previousUploadedLayers.forEach(layer => {
      if (!this.uploadedLayers.find(l => l.id === layer.id)) {
        this.removeUploadedLayer(layer.id);
      }
    });

    // Add new layers
    this.uploadedLayers.forEach(layer => {
      if (!this.previousUploadedLayers.find(l => l.id === layer.id)) {
        this.addUploadedLayer(layer);
      }
    });

    this.previousUploadedLayers = [...this.uploadedLayers];
  }

  // Load data from JSON files
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
      // Use default data in case of error
      this.loadDefaultConfiguration();
    }
  }

  // Load default data in case of JSON file loading failure
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

  // Initialize map
  private initializeMap(): void {
    // Setup TomTom map
    const viewport_height = window.innerHeight;
    const zoom = viewport_height < 620 ? 1.6 : this.defaultZoom;

    this.map = tt.map({
      key: this.TT_API_KEY,
      container: this.mapDiv.nativeElement,
      center: this.defaultCenter,
      zoom: zoom,
      style: 'https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAVVRVTzI1SHRBR3MxQXRBaDtiYWI4ZjY0Yi1lZDkwLTRjYTEtYTlkYy1mYjcxODIyNzdlMzA=/drafts/0.json'
    });

    // Controls
    this.map.addControl(new tt.NavigationControl());

    // Create popup
    this.popup = new tt.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px'
    });

    // Add click event to hide popup when clicking anywhere on the map
    this.map.on('click', (e: any) => {
      // Check if click is on a layer or popup
      const target = e.originalEvent.target;
      
      // Check if click is on popup elements
      const isOnPopup = target.closest('.mapboxgl-popup') ||
                       target.closest('.mapboxgl-popup-content') ||
                       target.closest('.mapboxgl-popup-close-button');
      
      // Check if click is on map controls
      const isOnControls = target.closest('.mapboxgl-ctrl') ||
                          target.closest('.mapboxgl-ctrl-group') ||
                          target.closest('.mapboxgl-marker');
      
      // Check if click is on any layer (SVG elements)
      const isOnLayer = target.closest('path') || 
                       target.closest('polygon') || 
                       target.closest('svg') ||
                       target.closest('.mapboxgl-interactive');
      
      // Only hide popup if clicking on empty map background (not on popup, controls, or layers)
      if (!isOnPopup && !isOnControls && !isOnLayer) {
        this.hidePopup();
      }
    });

    // Listen for map reset command
    this.mapControl.resetMap$.subscribe(() => {
      this.removeAllSourceLayers();
      this.removeUploadedLayers();
      this.hidePopup(); // Hide popup when resetting map
      this.map!.flyTo({
        center: this.defaultCenter,
        zoom: this.defaultZoom,
        pitch: 0,
        duration: 1000
      } as any);
    });

    this.mapSub = this.mapControl.layer$.subscribe(layerName => {
      // When receiving a new request from sidebar
      this.hidePopup(); // Hide popup when switching layers
      this.showGeoJsonLayer(layerName);
      // You can also apply flyTo automatically:
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
    

    // Set pointer cursor when hovering over layer
    this.layerID_use.forEach(layerId => this.setCursor(layerId));

    // Add Hover effect (colors) on layers
    this.hoverLayers.forEach(layerId => this.addHoverEffect(layerId));

    // Add flyTo events for each layer
    Object.entries(this.flyToConfig).forEach(([id, conf]) => {
      this.map!.on('click', id, () => {
        this.hidePopup(); // Hide popup when clicking on layers for flyTo
        this.map!.flyTo({
          center: conf.center,
          zoom: conf.zoom,
          pitch: conf.pitch,
          duration: 3000
        } as any); // Type assertion to bypass linter error for duration
      });
    });

    // Add click events for layers with popup
    this.popupLayers.forEach((layerName: string) => {
      this.map!.on('click', layerName, (e: any) => {
        this.polygonSelected.emit({ layer: layerName });
      });
    });

    // When map loads, add any additional settings:
    this.map.on('load', () => {
      this.mapIsLoaded = true;
      this.mapLoaded.emit();
      
      // Add existing uploaded layers
      this.uploadedLayers.forEach(layer => {
        this.addUploadedLayerToMap(layer);
      });
      
      // Add any pending layers
      this.pendingLayers.forEach(layer => {
        this.addUploadedLayerToMap(layer);
      });
      this.pendingLayers = [];
      
      this.previousUploadedLayers = [...this.uploadedLayers];
      // Example: load initial layer
      // this.showGeoJsonLayer('Project');
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
    if (this.mapSub) this.mapSub.unsubscribe();
  }

  // Load GeoJSON layer from assets/Layer/ folder
  showGeoJsonLayer(layerID: string): void {
    if (!this.map || !this.mapIsLoaded) return;
    this.removeAllSourceLayers();
    this.removeUploadedLayers();
    Promise.all([
      this.http.get(`assets/Layer/${layerID}.json`).toPromise(),
      this.http.get(`assets/Layer/${layerID}_outline.json`).toPromise()
    ]).then(([layer, outline]: [any, any]) => {
      this.map!.addLayer(layer);
      this.map!.addLayer(outline);
    });
  }

  // Add uploaded layer to map
  addUploadedLayer(layer: LayerInfo): void {
    if (!this.map || !this.mapIsLoaded) {
      // Add layer to pending queue if map is not loaded yet
      const existingPendingLayer = this.pendingLayers.find(l => l.id === layer.id);
      if (!existingPendingLayer) {
        this.pendingLayers.push(layer);
      }
      return;
    }

    this.addUploadedLayerToMap(layer);
  }

  // Actually add uploaded layer to map
  private addUploadedLayerToMap(layer: LayerInfo): void {
    if (!this.map || !this.mapIsLoaded) {
      return;
    }
    
    const fillLayerId = layer.id;
    const outlineLayerId = `${layer.id}_outline`;

    // Check if layer already exists
    if (this.uploadedLayerSources.has(layer.id)) {
      return;
    }

    try {
      // 1. Add the GeoJSON source (if not already added)
      if (this.map.getSource(fillLayerId)) {
        this.map.removeSource(fillLayerId);
      }
      
      this.map.addSource(fillLayerId, {
        type: 'geojson',
        data: layer.geojson
      });

      // 2. Add the fill layer
      this.map.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: fillLayerId,
        layout: {},
        paint: {
          'fill-color': layer.color,
          'fill-opacity': 0.4,
          'fill-outline-color': 'white'
        }
      });

      // 3. Add the outline layer
      this.map.addLayer({
        id: outlineLayerId,
        type: 'line',
        source: fillLayerId,
        layout: {},
        paint: {
          'line-color': '#fff',
          'line-width': 3
        }
      });

      // Add to supported/interactive lists
      this.layerID_use.push(fillLayerId, outlineLayerId);
      this.popupLayers.push(fillLayerId);
      this.hoverLayers.push(fillLayerId);

      // Add flyTo config
      const bounds = this.calculateBounds(layer.geojson);
      const center: [number, number] = [
        (bounds[0][0] + bounds[1][0]) / 2 + this.centerOffset.longitude,
        (bounds[0][1] + bounds[1][1]) / 2 + this.centerOffset.latitude
      ];
      this.flyToConfig[fillLayerId] = {
        center: center,
        zoom: this.calculateOptimalZoom(layer.geojson), // Use the configurable default zoom
        pitch: 45
      };

      // Add interactions
      this.addUploadedLayerInteractions(layer, fillLayerId, outlineLayerId);

      // Save refs
      this.uploadedLayerSources.set(layer.id, { fillLayerId, outlineLayerId });
    } catch (error) {
      console.error('Error adding layer to map:', error, layer.name);
    }
  }

  // Add interactions for uploaded layer
  private addUploadedLayerInteractions(layer: LayerInfo, fillLayerId: string, outlineLayerId: string): void {
    if (!this.map) return;

    // Hover effect on fill layer
    this.map.on('mouseenter', fillLayerId, () => {
      this.map!.getCanvas().style.cursor = 'pointer';
      this.map!.setPaintProperty(fillLayerId, 'fill-opacity', 0.6);
      this.map!.setPaintProperty(outlineLayerId, 'line-width', 4);
    });

    this.map.on('mouseleave', fillLayerId, () => {
      this.map!.getCanvas().style.cursor = '';
      this.map!.setPaintProperty(fillLayerId, 'fill-opacity', 0.4);
      this.map!.setPaintProperty(outlineLayerId, 'line-width', 3);
    });

    // Hover effect on outline layer
    this.map.on('mouseenter', outlineLayerId, () => {
      this.map!.getCanvas().style.cursor = 'pointer';
      this.map!.setPaintProperty(fillLayerId, 'fill-opacity', 0.6);
      this.map!.setPaintProperty(outlineLayerId, 'line-width', 4);
    });

    this.map.on('mouseleave', outlineLayerId, () => {
      this.map!.getCanvas().style.cursor = '';
      this.map!.setPaintProperty(fillLayerId, 'fill-opacity', 0.4);
      this.map!.setPaintProperty(outlineLayerId, 'line-width', 3);
    });

    // Click event to show popup (on both layers)
    [fillLayerId, outlineLayerId].forEach(layerId => {
      this.map!.on('click', layerId, (e: any) => {
        // Stop event propagation to prevent map click from hiding popup immediately
        e.originalEvent.stopPropagation();
        
        const coordinates = e.lngLat;
        const popupContent = this.createPopupContent(layer);
        
        this.popup!.setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(this.map!);
      });
    });
  }

  // Create popup content
  private createPopupContent(layer: LayerInfo): string {
    const formatArea = (area: number, unit: 'km' | 'm' | 'ha' = 'km'): string => {
      switch (unit) {
        case 'km': return `${area.toFixed(2)} km²`;
        case 'm': return `${(area * 1000000).toFixed(2)} m²`;
        case 'ha': return `${(area * 100).toFixed(2)} ha`;
        default: return `${area.toFixed(2)} km²`;
      }
    };

    const formatPerimeter = (perimeter: number, unit: 'km' | 'm' = 'km'): string => {
      switch (unit) {
        case 'km': return `${perimeter.toFixed(2)} km`;
        case 'm': return `${(perimeter * 1000).toFixed(2)} m`;
        default: return `${perimeter.toFixed(2)} km`;
      }
    };

    return `
      <div class="uploaded-layer-popup">
        <h6 style="color: ${layer.color}; margin-bottom: 12px;">
          <i class="bi bi-geo-alt"></i>
          ${layer.name}
        </h6>
        <div class="popup-stats">
          <div class="stat-row">
            <span class="stat-label">Area:</span>
            <span class="stat-value">${formatArea(layer.area, layer.areaUnit)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Perimeter:</span>
            <span class="stat-value">${formatPerimeter(layer.perimeter, layer.perimeterUnit)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Center:</span>
            <span class="stat-value">${layer.center[0].toFixed(6)}, ${layer.center[1].toFixed(6)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Type:</span>
            <span class="stat-value">${layer.type === 'shapefile' ? 'Shapefile' : 'KML'}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Zoom to uploaded layer
  zoomToUploadedLayer(layer: LayerInfo): void {
    if (!this.map) return;

    // Look for flyTo settings for the layer
    const layerFlyToConfig = this.flyToConfig[layer.id];
    
    if (layerFlyToConfig) {
      // Use saved flyTo settings
      this.map.flyTo({
        center: layerFlyToConfig.center,
        zoom: layerFlyToConfig.zoom,
        pitch: layerFlyToConfig.pitch,
        duration: 2000
      } as any);
    } else {
      // If no saved settings, calculate center and use default zoom
      const bounds = this.calculateBounds(layer.geojson);
      const center: [number, number] = [
        (bounds[0][0] + bounds[1][0]) / 2 + this.centerOffset.longitude,
        (bounds[0][1] + bounds[1][1]) / 2 + this.centerOffset.latitude
      ];
      
      this.map.flyTo({
        center: center,
        zoom: this.calculateOptimalZoom(layer.geojson), // Use the configurable default zoom
        pitch: 45,
        duration: 2000
      } as any);
    }
  }

  // Calculate layer bounds
  private calculateBounds(geojson: any): [[number, number], [number, number]] {
    let minLng = Infinity, maxLng = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;

    const processCoordinates = (coordinates: number[]): void => {
      if (coordinates.length >= 2) {
        const [lng, lat] = coordinates;
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      }
    };

    const processGeometry = (geometry: any): void => {
      switch (geometry.type) {
        case 'Point':
          processCoordinates(geometry.coordinates);
          break;
        case 'LineString':
          geometry.coordinates.forEach((coord: number[]) => processCoordinates(coord));
          break;
        case 'Polygon':
          geometry.coordinates.forEach((ring: number[][]) => {
            ring.forEach((coord: number[]) => processCoordinates(coord));
          });
          break;
        case 'MultiPoint':
          geometry.coordinates.forEach((coord: number[]) => processCoordinates(coord));
          break;
        case 'MultiLineString':
          geometry.coordinates.forEach((line: number[][]) => {
            line.forEach((coord: number[]) => processCoordinates(coord));
          });
          break;
        case 'MultiPolygon':
          geometry.coordinates.forEach((polygon: number[][][]) => {
            polygon.forEach((ring: number[][]) => {
              ring.forEach((coord: number[]) => processCoordinates(coord));
            });
          });
          break;
        default:
          console.warn('Unknown geometry type:', geometry.type);
      }
    };

    if (geojson.features && Array.isArray(geojson.features)) {
      geojson.features.forEach((feature: any) => {
        if (feature.geometry) {
          processGeometry(feature.geometry);
        }
      });
    }

    // Validate results
    if (minLng === Infinity || maxLng === -Infinity || minLat === Infinity || maxLat === -Infinity) {
      console.error('Invalid bounds calculated:', { minLng, maxLng, minLat, maxLat });
      // Return small default bounds
      return [[0, 0], [0.01, 0.01]];
    }

    return [[minLng, minLat], [maxLng, maxLat]];
  }

  // Remove uploaded layer
  removeUploadedLayer(layerId: string): void {
    if (!this.map) return;

    // Remove from pending queue if found
    this.pendingLayers = this.pendingLayers.filter(layer => layer.id !== layerId);

    const layerRefs = this.uploadedLayerSources.get(layerId);
    if (layerRefs) {
      const { fillLayerId, outlineLayerId } = layerRefs;

      try {
        // Check if layer exists before removing
        if (this.map.getLayer(fillLayerId)) {
          this.map.removeLayer(fillLayerId);
        }
        if (this.map.getLayer(outlineLayerId)) {
          this.map.removeLayer(outlineLayerId);
        }
        
        // Remove source if it exists
        if (this.map.getSource(fillLayerId)) {
          this.map.removeSource(fillLayerId);
        }
        
        // Remove layers from supported lists
        this.layerID_use = this.layerID_use.filter(id => id !== fillLayerId && id !== outlineLayerId);
        this.popupLayers = this.popupLayers.filter(id => id !== fillLayerId);
        this.hoverLayers = this.hoverLayers.filter(id => id !== fillLayerId);
        
        // Remove flyTo settings
        delete this.flyToConfig[fillLayerId];
        
        this.uploadedLayerSources.delete(layerId);
      } catch (error) {
        console.error('Error removing uploaded layer:', error);
      }
    }
  }

  // Remove all uploaded layers
  removeUploadedLayers(): void {
    this.uploadedLayers.forEach(layer => {
      this.removeUploadedLayer(layer.id);
    });
  }

  // Remove all custom layers from map
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

  // Set mouse cursor to pointer when hovering over layer
  setCursor(layerId: string): void {
    if (!this.map) return;
    this.map.on('mouseenter', layerId, () => {
      this.map!.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', layerId, () => {
      this.map!.getCanvas().style.cursor = '';
    });
  }

  // Hover effect (color change) on layer
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

  // To show a new layer when selected from sidebar, call:
  // this.showGeoJsonLayer('layer_name');

  private getDarkerColor(color: string): string {
    // If color is not in hex format, return black
    if (!color.startsWith('#')) {
      return '#000000';
    }

    const hex = color.replace('#', '');
    
    // If color is short (3 characters), expand it
    if (hex.length === 3) {
      const expanded = hex.split('').map(char => char + char).join('');
      return this.getDarkerColor('#' + expanded);
    }
    
    // If color is not 6 characters, return black
    if (hex.length !== 6) {
      return '#000000';
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Make color darker by 40%
    const darkerR = Math.max(0, Math.floor(r * 0.6));
    const darkerG = Math.max(0, Math.floor(g * 0.6));
    const darkerB = Math.max(0, Math.floor(b * 0.6));

    return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
  }

  // Calculate optimal zoom level based on layer size
  private calculateOptimalZoom(geojson: any): number {
    const bounds = this.calculateBounds(geojson);
    
    // Calculate layer dimensions
    const latDiff = bounds[1][1] - bounds[0][1]; // Latitude difference
    const lngDiff = bounds[1][0] - bounds[0][0]; // Longitude difference
    
    // Log detailed information for diagnosis
    console.log('Layer bounds:', bounds);
    console.log('Lat difference:', latDiff);
    console.log('Lng difference:', lngDiff);
    
    // Calculate largest dimension (length or width)
    const maxDimension = Math.max(latDiff, lngDiff);
    console.log('Max dimension:', maxDimension);
    
    // Calculate zoom based on largest dimension
    let zoom: number;
    
    if (maxDimension >= 20) {
      // Very large layer (continent or large country)
      zoom = 3;
    } else if (maxDimension >= 10) {
      // Large layer (medium country)
      zoom = 4;
    } else if (maxDimension >= 5) {
      // Medium-large layer (region or province)
      zoom = 5;
    } else if (maxDimension >= 2) {
      // Medium layer (large city)
      zoom = 6;
    } else if (maxDimension >= 1) {
      // Small layer (small city)
      zoom = 7;
    } else if (maxDimension >= 0.5) {
      // Very small layer (neighborhood)
      zoom = 9.5;
    } else if (maxDimension >= 0.1) {
      // Precise layer (small area)
      zoom = 12;
    } else if (maxDimension >= 0.05) {
      // Very precise layer (complex or large building)
      zoom = 13;
    } else if (maxDimension >= 0.01) {
      // Very small layer (building or land plot)
      zoom = 15;
    } else {
      // Extremely small layer (point or small object)
      zoom = 17;
    }
    
    console.log('Calculated zoom:', zoom);
    
    // Ensure zoom is within allowed limits
    const finalZoom = Math.max(2, Math.min(20, zoom));
    console.log('Final zoom:', finalZoom);
    
    return finalZoom;
  }

  // Hide popup method
  private hidePopup(): void {
    if (this.popup && this.popup.isOpen()) {
      this.popup.remove();
    }
  }

  // Public method to hide popup (can be called from parent components)
  public closePopup(): void {
    this.hidePopup();
  }
}
