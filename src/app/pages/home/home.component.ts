import { Component, HostListener, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MapControlService } from '../../services/map-control.service';
import { AuthService } from '../../services/auth.service';
import { LoadingComponent } from '../../loading/loading.component';
import { LayerInfo } from '../../components/file-upload/file-upload.component';
import { MapViewComponent } from '../../components/map-view/map-view.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wrapper', { static: false }) wrapper!: ElementRef;
  @ViewChild('scroller', { static: false }) scroller!: ElementRef;
  @ViewChild('after', { static: false }) after!: ElementRef;
  @ViewChild('loadingComponent', { static: false }) loadingComponent!: LoadingComponent;
  @ViewChild('mapView', { static: false }) mapView!: MapViewComponent;

  showProfileMenu = false;
  showDetectionMenu = false;
  activeSidebarIndex = 1; // Home active by default
  lastClickedSidebarIndex = 1; // Track the last clicked sidebar item
  submenuOpen: string | null = null;
  popupData: any = null;
  showLeftDates = false;
  showRightDates = false;
  sliderX: number = 250;
  username: string | null = null;
  isSliderActive = false;
  isMapLoaded = false; // Control content visibility
  isPolygonClickInProgress = false; // Track polygon click state

  // Layer configuration loaded from JSON file
  layersConfig: Record<string, any> = {};
  currentLayerConfig: any = null;

  // Variables for uploaded layers
  uploadedLayers: LayerInfo[] = [];
  showFileUpload = false;

  constructor(
    private mapControl: MapControlService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {
    this.username = this.authService.getUsername();
  }

  ngOnInit() {
    this.activeSidebarIndex = 1;
    this.loadLayersConfig();
  }

  loadLayersConfig() {
    this.http.get<Record<string, any>>('assets/Layer/layersConfig.json')
      .subscribe({
        next: (data) => {
          this.layersConfig = data;
          // console.log('Layers config loaded successfully:', this.layersConfig);
        },
        error: (error) => {
          console.error('Error loading layers config:', error);
        }
      });
  }

  ngAfterViewInit() {
    // initSlider will be called when popup opens
    // Add window resize listener for responsive slider
    window.addEventListener('resize', () => {
      if (this.popupData) {
        this.handleResize();
      }
    });

    // Add event listeners for select buttons after view is initialized
    // setTimeout(() => {
    //   this.initializeSelectButtons();
    // }, 100);
  }

  // initializeSelectButtons() {
  //   console.log('initializeSelectButtons called');
  //   // The click events are already handled by Angular's (click) directives
  //   // We just need to ensure the click outside functionality works
    
  //   // Add click outside listeners to close the dropdowns
  //   document.addEventListener('click', (event) => {
  //     const target = event.target as HTMLElement;
      
  //     // Close left selector if clicked outside
  //     if (this.leftSelector && !this.leftSelector.nativeElement.contains(target)) {
  //       this.showLeftDates = false;
  //     }
      
  //     // Close right selector if clicked outside
  //     if (this.rightSelector && !this.rightSelector.nativeElement.contains(target)) {
  //       this.showRightDates = false;
  //     }
  //   });
  // }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    if (this.showProfileMenu) {
      this.showDetectionMenu = false;
      this.activeSidebarIndex = 99;
    } else {
      this.activeSidebarIndex = 0;
    }
  }

  toggleDetectionMenu() {
    this.showDetectionMenu = !this.showDetectionMenu;
    if (this.showDetectionMenu) {
      this.showProfileMenu = false;
      this.activeSidebarIndex = 2;
    } else {
      this.activeSidebarIndex = 0;
    }
  }

  // Toggle file upload component display
  toggleFileUpload() {
    this.showFileUpload = !this.showFileUpload;
    if (this.showFileUpload) {
      this.showDetectionMenu = false;
      this.showProfileMenu = false;
      this.activeSidebarIndex = 4; // New number for file upload
    } else {
      this.activeSidebarIndex = 1;
    }
  }

  setActiveSidebar(idx: number) {
    // Close date selectors when clicking on sidebar
    this.showLeftDates = false;
    this.showRightDates = false;
    
    if (idx === 2) {
      this.closePopup(); // Close dialog_detect when clicking Detection
      if (this.showDetectionMenu) {
        this.showDetectionMenu = false;
        this.activeSidebarIndex = 1;
        this.lastClickedSidebarIndex = 1;
      } else {
        this.activeSidebarIndex = 2;
        this.lastClickedSidebarIndex = 2;
        this.showDetectionMenu = true;
        this.showProfileMenu = false;
        this.showFileUpload = false;
      }
    } else if (idx === 4) {
      this.toggleFileUpload();
    } else if (idx === 1) {
      this.activeSidebarIndex = 1;
      this.lastClickedSidebarIndex = 1;
      this.showDetectionMenu = false;
      this.showProfileMenu = false;
      this.showFileUpload = false;
      this.closeSubmenu();
      this.mapControl.resetMapToDefault();
    } else {
      this.activeSidebarIndex = idx;
      this.lastClickedSidebarIndex = idx;
      this.showDetectionMenu = false;
      this.showProfileMenu = false;
      this.showFileUpload = false;
      this.closeSubmenu();
    }
  }

  // Handle adding new layer
  onLayerAdded(layer: LayerInfo) {
    // Create new array to ensure ngOnChanges is triggered in map component
    this.uploadedLayers = [...this.uploadedLayers, layer];
    
    // Zoom to new layer with short delay to ensure layer is added first
    setTimeout(() => {
      this.zoomToLayer(layer);
    }, 500);
  }

  // Handle layer removal
  onLayerRemoved(layerId: string) {
    // Create new array to ensure ngOnChanges is triggered in map component
    this.uploadedLayers = this.uploadedLayers.filter(layer => layer.id !== layerId);
  }

  // Handle zoom request for layer
  onLayerZoomRequested(layer: LayerInfo) {
    this.zoomToLayer(layer);
  }

  // Hide file upload panel when clicking on map
  hideFileUploadPanel(): void {
    this.showFileUpload = false;
  }

  // Zoom to layer
  private zoomToLayer(layer: LayerInfo) {
    if (this.mapView) {
      this.mapView.zoomToUploadedLayer(layer);
    }
  }

  onSidebarLayerClick(layerName: string) {
    // Close date selectors when clicking on sidebar items
    this.showLeftDates = false;
    this.showRightDates = false;
    
    this.mapControl.showLayer(layerName);
    this.closeSubmenu(); // To close popup menus after clicking (optional)
    this.hideDetectionMenu(); // Hide main menu after selecting an item
  }

  hideDetectionMenu() {
    this.showDetectionMenu = false;
  }

  openSubmenu(menuName: string) {
    this.submenuOpen = menuName;
  }
  closeSubmenu() {
    this.submenuOpen = null;
  }

  onPolygonSelected(event: { layer: string }) {
    this.showDetectionMenu = false; // Close list_detection if open
    // console.log('onPolygonSelected called with layer:', event.layer);
    // console.log('Available layers:', Object.keys(this.layersConfig));
    
    // Set polygon click flag to prevent immediate closing
    this.isPolygonClickInProgress = true;
    
    // Prevent immediate closing by adding a small delay
    setTimeout(() => {
      this.currentLayerConfig = this.layersConfig[event.layer] || null;
      // console.log('Current layer config set to:', this.currentLayerConfig);
      
      this.popupData = this.currentLayerConfig;
      this.sliderX = 250;
      
      // Initialize slider after popup is shown
      setTimeout(() => {
        this.initSlider();
        // this.initializeSelectButtons(); // Reinitialize select buttons for new popup
      }, 100);
      
      // Reset polygon click flag after a delay
      setTimeout(() => {
        this.isPolygonClickInProgress = false;
      }, 200);
    }, 50);
  }
  
  closePopup() { 
    this.currentLayerConfig = null;
    this.popupData = null;
    this.isPolygonClickInProgress = false; // Reset polygon click flag
    
    // Close date selectors when closing dialog
    this.showLeftDates = false;
    this.showRightDates = false;
  }
  
  toggleLeftDates(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    // console.log('toggleLeftDates called');
    // console.log('Current showLeftDates:', this.showLeftDates);
    // console.log('Current layer config:', this.currentLayerConfig);
    // console.log('Left dates available:', this.currentLayerConfig?.leftDates);
    
    this.showLeftDates = !this.showLeftDates;
    this.showRightDates = false;
    
    // console.log('New showLeftDates:', this.showLeftDates);
  }
  
  toggleRightDates(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    // console.log('toggleRightDates called');
    // console.log('Current showRightDates:', this.showRightDates);
    // console.log('Current layer config:', this.currentLayerConfig);
    // console.log('Right dates available:', this.currentLayerConfig?.rightDates);
    
    this.showRightDates = !this.showRightDates;
    this.showLeftDates = false;
    
    // console.log('New showRightDates:', this.showRightDates);
  }
  
  selectLeftDate(date: string) {
    // console.log('selectLeftDate called with:', date);
    if (this.currentLayerConfig) {
      this.currentLayerConfig.leftDate = date;
      this.showLeftDates = false;
      
      // Update the left image if we have a mapping for the current layer
      if (this.currentLayerConfig.leftImagesMap && this.currentLayerConfig.leftImagesMap[date]) {
        // console.log('Updating left image to:', this.currentLayerConfig.leftImagesMap[date]);
        // Update the currentLayerConfig.images.left for consistency
        this.currentLayerConfig.images.left = this.currentLayerConfig.leftImagesMap[date];
        // Force Angular to detect changes
        this.cdr.detectChanges();
      }
    }
  }
  
  selectRightDate(date: string) {
    // console.log('selectRightDate called with:', date);
    if (this.currentLayerConfig) {
      this.currentLayerConfig.rightDate = date;
      this.showRightDates = false;
      
      // Update the right image if we have a mapping for the current layer
      if (this.currentLayerConfig.rightImagesMap && this.currentLayerConfig.rightImagesMap[date]) {
        // console.log('Updating right image to:', this.currentLayerConfig.rightImagesMap[date]);
        // Update the currentLayerConfig.images.right for consistency
        this.currentLayerConfig.images.right = this.currentLayerConfig.rightImagesMap[date];
        // Force Angular to detect changes
        this.cdr.detectChanges();
      }
    }
  }
  
  initSlider() {
    if (!this.wrapper || !this.scroller || !this.after) return;
    this.handleResize();
  }

  handleResize() {
    if (!this.wrapper) return;
    const wrapper = this.wrapper.nativeElement;
    const width_image = wrapper.getBoundingClientRect().width;
    
    // Update image widths
    const imgRight = document.getElementById('img_right') as HTMLImageElement;
    const imgLeft = document.getElementById('img_left') as HTMLImageElement;
    if (imgRight) imgRight.style.width = width_image + "px";
    if (imgLeft) imgLeft.style.width = width_image + "px";
    
    // Initialize slider position
    this.scrollIt(250);
  }

  scrollIt(x: number) {
    if (!this.wrapper || !this.scroller || !this.after) return;
    const wrapper = this.wrapper.nativeElement;
    const scroller = this.scroller.nativeElement;
    const after = this.after.nativeElement;
    
    const minWidth = 0;
    const maxWidth = wrapper.getBoundingClientRect().width;
    const initialPosition = 250;
    let transform = initialPosition + (x - initialPosition);
    transform = Math.min(Math.max(transform, minWidth), maxWidth);
    
    after.style.width = transform + "px";
    scroller.style.left = transform + "px";
    this.sliderX = transform;
  }

  onSliderMouseDown(event: MouseEvent) {
    this.isSliderActive = true;
    if (this.scroller) {
      this.scroller.nativeElement.classList.add('scrolling');
    }
    document.body.style.userSelect = 'none';
  }

  onSliderMouseUp() {
    this.isSliderActive = false;
    if (this.scroller) {
      this.scroller.nativeElement.classList.remove('scrolling');
    }
    document.body.style.userSelect = '';
  }

  onSliderMouseMove(event: MouseEvent) {
    if (!this.isSliderActive || !this.wrapper) return;
    const wrapper = this.wrapper.nativeElement;
    let x = event.pageX;
    x -= wrapper.getBoundingClientRect().left;
    this.scrollIt(x);
  }

  onSliderTouchStart(event: TouchEvent) {
    this.isSliderActive = true;
    if (this.scroller) {
      this.scroller.nativeElement.classList.add('scrolling');
    }
  }

  onSliderTouchEnd() {
    this.isSliderActive = false;
    if (this.scroller) {
      this.scroller.nativeElement.classList.remove('scrolling');
    }
  }

  onSliderTouchMove(event: TouchEvent) {
    if (!this.isSliderActive || !this.wrapper) return;
    const wrapper = this.wrapper.nativeElement;
    let x = event.touches[0].pageX;
    x -= wrapper.getBoundingClientRect().left;
    this.scrollIt(x);
  }

  onMapLoaded() {
    if (this.loadingComponent) {
      this.loadingComponent.onMapLoaded();
    }
    // Show the home content after map is loaded
    this.isMapLoaded = true;
    
    // Add cursor change functionality for map layers
    this.setupCursorChanges();
  }

  setupCursorChanges() {
    // Get the map element
    const mapElement = document.getElementById('map_section');
    if (!mapElement) return;

    // Add mouse move event to handle cursor changes dynamically
    mapElement.addEventListener('mousemove', (event) => {
      const target = event.target as HTMLElement;
      
      // Check for various map layer elements
      const isOverLayer = target.closest('path') || 
                         target.closest('polygon') || 
                         target.closest('.leaflet-interactive') ||
                         target.closest('svg') ||
                         target.closest('.leaflet-overlay-pane') ||
                         target.closest('.leaflet-pane') ||
                         target.tagName === 'path' ||
                         target.tagName === 'polygon' ||
                         target.classList.contains('leaflet-interactive');
      
      if (isOverLayer) {
        this.changeCursorToPointer();
      } else {
        this.resetCursor();
      }
    });

    // Add mouse enter event for the entire map
    mapElement.addEventListener('mouseenter', () => {
      // Don't change cursor here, let mousemove handle it
    });

    // Add mouse leave event for the entire map
    mapElement.addEventListener('mouseleave', () => {
      this.resetCursor();
    });

    // Setup event listeners for existing elements
    this.setupElementEventListeners(mapElement);

    // Use MutationObserver to watch for new elements being added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // New elements added, reinitialize event listeners
          this.setupElementEventListeners(mapElement);
        }
      });
    });

    // Start observing
    observer.observe(mapElement, {
      childList: true,
      subtree: true
    });
  }

  setupElementEventListeners(mapElement: HTMLElement) {
    // Add specific event listeners for SVG elements
    const svgElements = mapElement.querySelectorAll('svg');
    svgElements.forEach(svg => {
      // Remove existing listeners to avoid duplicates
      svg.removeEventListener('mouseenter', this.changeCursorToPointer.bind(this));
      svg.removeEventListener('mouseleave', this.resetCursor.bind(this));
      
      // Add new listeners
      svg.addEventListener('mouseenter', () => {
        this.changeCursorToPointer();
      });
      
      svg.addEventListener('mouseleave', () => {
        this.resetCursor();
      });
    });

    // Add event listeners for path and polygon elements specifically
    const pathElements = mapElement.querySelectorAll('path, polygon');
    pathElements.forEach(element => {
      // Remove existing listeners to avoid duplicates
      element.removeEventListener('mouseenter', this.changeCursorToPointer.bind(this));
      element.removeEventListener('mouseleave', this.resetCursor.bind(this));
      
      // Add new listeners
      element.addEventListener('mouseenter', () => {
        this.changeCursorToPointer();
      });
      
      element.addEventListener('mouseleave', () => {
        this.resetCursor();
      });
    });
  }

  changeCursorToPointer() {
    const mapElement = document.getElementById('map_section');
    if (mapElement) {
      mapElement.style.cursor = 'pointer';
    }
  }

  resetCursor() {
    const mapElement = document.getElementById('map_section');
    if (mapElement) {
      mapElement.style.cursor = 'default';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Hide file upload panel when clicking outside it (but not on sidebar)
    const sidebarElement = document.querySelector('.Side_bar');
    const fileUploadPanel = document.querySelector('.file-upload-panel');
    
    if (fileUploadPanel && !fileUploadPanel.contains(target) && 
        sidebarElement && !sidebarElement.contains(target)) {
      this.hideFileUploadPanel();
    }
    
    // Don't handle if polygon click is in progress
    if (this.isPolygonClickInProgress) {
      return;
    }
    
    // Handle sidebar menu clicks
    if (
      !target.closest('.list_detection') &&
      !target.closest('.list_detection2') &&
      !target.closest('.detection_icon') &&
      !target.closest('#dropdownUser3') &&
      !target.closest('.list_detection1')
    ) {
      this.showDetectionMenu = false;
      this.showProfileMenu = false;
      this.closeSubmenu();
    }
    
    // Close date selectors if clicking outside them
    const leftSelector = document.getElementById('left_selector');
    const rightSelector = document.getElementById('right_selector');
    
    if (leftSelector && !leftSelector.contains(target)) {
      this.showLeftDates = false;
    }
    
    if (rightSelector && !rightSelector.contains(target)) {
      this.showRightDates = false;
    }
    
    // Close date selectors if clicking inside dialog_detect but outside selectors
    const dialogElement = document.getElementById('dialog_detect');
    if (dialogElement && dialogElement.contains(target)) {
      // Check if click is on select buttons or options - don't close if it is
      if (!target.closest('.select-btn') && !target.closest('.select-btn1') && 
          !target.closest('.options') && !target.closest('.options1') &&
          !target.closest('.option') && !target.closest('.option1') &&
          !target.closest('.select-menu') && !target.closest('.select-menu1')) {
        if (leftSelector && !leftSelector.contains(target)) {
          this.showLeftDates = false;
        }
        
        if (rightSelector && !rightSelector.contains(target)) {
          this.showRightDates = false;
        }
      }
    }
    
    // Handle dropdown and dialog clicks - only if dialog is already open
    if (this.currentLayerConfig) {
      const dialogElement = document.getElementById('dialog_detect');
      const mapElement = document.getElementById('map_section');
      const sidebarElement = document.querySelector('.Side_bar');
      
      // Check if click is on dropdown buttons - don't close if it is
      if (target.closest('.select-btn') || target.closest('.select-btn1')) {
        return;
      }
      
      // Check if click is on map polygon/layer elements - don't close if it is
      const isOnPolygon = target.closest('path') || 
                         target.closest('polygon') || 
                         target.closest('.leaflet-interactive') ||
                         target.closest('svg') ||
                         target.closest('.leaflet-overlay-pane') ||
                         target.closest('.leaflet-pane') ||
                         target.tagName === 'path' ||
                         target.tagName === 'polygon' ||
                         target.classList.contains('leaflet-interactive');
      
      if (isOnPolygon) {
        return;
      }
      
      // Close date selectors if clicking inside dialog but outside selectors
      if (dialogElement && dialogElement.contains(target)) {
        const leftSelector = document.getElementById('left_selector');
        const rightSelector = document.getElementById('right_selector');
        
        // Check if click is on select buttons or options - don't close if it is
        if (!target.closest('.select-btn') && !target.closest('.select-btn1') && 
            !target.closest('.options') && !target.closest('.options1') &&
            !target.closest('.option') && !target.closest('.option1') &&
            !target.closest('.select-menu') && !target.closest('.select-menu1')) {
          if (leftSelector && !leftSelector.contains(target)) {
            this.showLeftDates = false;
          }
          
          if (rightSelector && !rightSelector.contains(target)) {
            this.showRightDates = false;
          }
        }
      }
      
      // Close dialog if clicking outside both map and sidebar
      if (mapElement && sidebarElement && dialogElement) {
        if (!mapElement.contains(target) && !sidebarElement.contains(target)) {
          this.closePopup();
        }
      }
    }
  }

  // Handle map clicks separately to allow polygon clicks while closing dialog on map background
  @HostListener('click', ['$event'])
  onMapClick(event: Event) {
    const target = event.target as HTMLElement;
    const mapElement = document.getElementById('map_section');
    const dialogElement = document.getElementById('dialog_detect');
    
    // Hide file upload panel when clicking on map
    if (mapElement && mapElement.contains(target)) {
      this.hideFileUploadPanel();
    }
    
    // Don't handle if polygon click is in progress
    if (this.isPolygonClickInProgress) {
      return;
    }
    
    // Close date selectors if clicking on map
    if (mapElement && mapElement.contains(target)) {
      this.showLeftDates = false;
      this.showRightDates = false;
    }
    
    // Only handle if dialog is open and click is on map
    if (this.currentLayerConfig && mapElement && dialogElement && mapElement.contains(target)) {
      // Check if the click is on a polygon/layer element
      const isOnPolygon = target.closest('path') || 
                         target.closest('polygon') || 
                         target.closest('.leaflet-interactive') ||
                         target.closest('svg') ||
                         target.closest('.leaflet-overlay-pane') ||
                         target.closest('.leaflet-pane') ||
                         target.tagName === 'path' ||
                         target.tagName === 'polygon' ||
                         target.classList.contains('leaflet-interactive');
      
      // If clicking on map background (not on polygon), close dialog
      if (!isOnPolygon && !dialogElement.contains(target)) {
        // Small delay to allow polygon click events to process first
        setTimeout(() => {
          if (this.currentLayerConfig && document.getElementById('dialog_detect')) {
            this.closePopup();
          }
        }, 100);
      }
    }
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp() {
    this.onSliderMouseUp();
  }

  @HostListener('document:mouseleave')
  onDocumentMouseLeave() {
    this.onSliderMouseUp();
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    this.onSliderMouseMove(event);
  }

  @HostListener('document:touchend')
  onDocumentTouchEnd() {
    this.onSliderTouchEnd();
  }

  @HostListener('document:touchcancel')
  onDocumentTouchCancel() {
    this.onSliderTouchEnd();
  }

  @HostListener('document:touchmove', ['$event'])
  onDocumentTouchMove(event: TouchEvent) {
    this.onSliderTouchMove(event);
  }

  ngOnDestroy() {
    // Cleanup event listeners
    window.removeEventListener('resize', () => {});
    document.removeEventListener('click', () => {});
    document.removeEventListener('mouseup', () => {});
    document.removeEventListener('mouseleave', () => {});
    document.removeEventListener('mousemove', () => {});
    document.removeEventListener('touchend', () => {});
    document.removeEventListener('touchcancel', () => {});
    document.removeEventListener('touchmove', () => {});
  }

  closeDateSelectorsOnContainer(event: Event) {
    const target = event.target as HTMLElement;
    
    // Check if click is on select elements - don't close if it is
    if (target.closest('.select-btn') || target.closest('.select-btn1') || 
        target.closest('.options') || target.closest('.options1') ||
        target.closest('.option') || target.closest('.option1') ||
        target.closest('.select-menu') || target.closest('.select-menu1') ||
        target.closest('.list_date_container') || target.closest('.ul_container2')) {
      return;
    }
    
    // Close date selectors
    this.showRightDates = false;
    this.showLeftDates = false;
    
    event.stopPropagation();
  }
}
