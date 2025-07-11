import { Component, HostListener, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MapControlService } from '../../services/map-control.service';
import { AuthService } from '../../services/auth.service';
import { LoadingComponent } from '../../loading/loading.component';

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

  // Comprehensive layer configuration matching old JavaScript code
  layersConfig: Record<string, any> = {
    'Project': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/2-2022.jpg',
        right: 'assets/Geo File/Polygon Create/6-2023.jpg',
        news: 'assets/Geo File/Polygon Create/Screenshot.png',
        dash1: 'assets/Dashbord/3.png',
        dash2: 'assets/Dashbord/4.png',
        dash3: 'assets/Dashbord/6.png'
      },
      leftDates: ['2-2022', '6-2023'],
      rightDates: ['2-2022', '6-2023'],
      leftImagesMap: {
        '2-2022': 'assets/Geo File/Polygon Create/2-2022.jpg',
        '6-2023': 'assets/Geo File/Polygon Create/6-2023.jpg'
      },
      rightImagesMap: {
        '2-2022': 'assets/Geo File/Polygon Create/2-2022.jpg',
        '6-2023': 'assets/Geo File/Polygon Create/6-2023.jpg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: true,
        element6: true
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '58%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: 'auto'
      },
      newsLink: 'https://www.thecitizen.co.tz/tanzania/news/national/mwanza-gets-ready-for-mega-mall-2533096',
      leftDate: '2-2022',
      rightDate: '6-2023'
    },
    'Forest_Logging_Detection': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/6-1-2023.jpg',
        right: 'assets/Geo File/Polygon Create/10-3-2024.jpg',
        news: 'assets/Geo File/Polygon Create/Forest_Logging_News.png',
        dash1: 'assets/Data/Forest_Logging_Detection/Dashboed/11.png',
        dash2: 'assets/Data/Forest_Logging_Detection/Dashboed/13.png'
      },
      leftDates: ['6-1-2023', '16-12-2023', '10-3-2024'],
      rightDates: ['6-1-2023', '16-12-2023', '10-3-2024'],
      leftImagesMap: {
        '6-1-2023': 'assets/Geo File/Polygon Create/6-1-2023.jpg',
        '16-12-2023': 'assets/Geo File/Polygon Create/16-12-2023.jpg',
        '10-3-2024': 'assets/Geo File/Polygon Create/10-3-2024.jpg'
      },
      rightImagesMap: {
        '6-1-2023': 'assets/Geo File/Polygon Create/6-1-2023.jpg',
        '16-12-2023': 'assets/Geo File/Polygon Create/16-12-2023.jpg',
        '10-3-2024': 'assets/Geo File/Polygon Create/10-3-2024.jpg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: 'auto'
      },
      newsLink: 'https://www.lifegate.com/congo-basin-rainforest-logging',
      leftDate: '6-1-2023',
      rightDate: '10-3-2024'
    },
    'Land_Cover': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/land-C-S-image-2020.jpg',
        right: 'assets/Geo File/Polygon Create/land-C-S-image-2023.jpg',
        news: 'assets/Geo File/Polygon Create/Screenshot.png',
        dash1: 'assets/Geo File/Polygon Create/land.C.barchart.jpg',
        dash2: 'assets/Geo File/Polygon Create/land.C.Chart.2015.jpg',
        dash3: 'assets/Geo File/Polygon Create/land.C.Chart.2020.jpg'
      },
      leftDates: ['2020', '2023'],
      rightDates: ['2020', '2023'],
      leftImagesMap: {
        '2020': 'assets/Geo File/Polygon Create/land-C-S-image-2020.jpg',
        '2023': 'assets/Geo File/Polygon Create/land-C-S-image-2023.jpg'
      },
      rightImagesMap: {
        '2020': 'assets/Geo File/Polygon Create/land-C-S-image-2020.jpg',
        '2023': 'assets/Geo File/Polygon Create/land-C-S-image-2023.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: true,
        dash3: true,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: 'auto'
      },
      newsLink: 'https://www.thecitizen.co.tz/tanzania/news/national/mwanza-gets-ready-for-mega-mall-2533096',
      leftDate: '2020',
      rightDate: '2023'
    },
    'Squatters_Camps': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Squatters_Camps-1-2020.jpg',
        right: 'assets/Geo File/Polygon Create/Squatters_Camps-12-2022.jpg',
        news: 'assets/Geo File/Polygon Create/Squatters_Camps_new.jpg'
      },
      leftDates: ['1-2020', '12-2022'],
      rightDates: ['1-2020', '12-2022'],
      leftImagesMap: {
        '1-2020': 'assets/Geo File/Polygon Create/Squatters_Camps-1-2020.jpg',
        '12-2022': 'assets/Geo File/Polygon Create/Squatters_Camps-12-2022.jpg'
      },
      rightImagesMap: {
        '1-2020': 'assets/Geo File/Polygon Create/Squatters_Camps-1-2020.jpg',
        '12-2022': 'assets/Geo File/Polygon Create/Squatters_Camps-12-2022.jpg'
      },
      display: {
        news: true,
        dash1: false,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: '100%',
        dashbordHeight: '100%',
        element7Width: '100%',
        timelineHeight: 'auto',
        containerRow2Height: 'auto',
        newsHeight: '140px'
      },
      newsLink: 'https://www.sciencephoto.com/media/182797/view/squatter-camp',
      leftDate: '1-2020',
      rightDate: '12-2022'
    },
    'Dumyat': {
      showDashboard: false,
      showVideo: true,
      videoSrc: 'assets/videos/Crop_classification_Dumyat.mp4'
    },
    'Cahnge_Detection_Cairo': {
      showDashboard: false,
      showVideo: true,
      videoSrc: 'assets/videos/Build_detiction_Cairo.mp4'
    },
    'Ain_Sokhna_Port': {
      showDashboard: false,
      showVideo: true,
      videoSrc: 'assets/videos/Monitoring_Project_Ain_Sokhna_Port.mp4'
    },
    'Detect_rice_straw_burning': {
      showDashboard: false,
      showVideo: true,
      videoSrc: 'assets/videos/Detect_rice_straw_burning.mp4'
    },
    'khartoum_airport': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/khartoum_airport_20-2-2023.jpg',
        right: 'assets/Geo File/Polygon Create/khartoum_airport_4-5-2024.jpg',
        news: 'assets/Geo File/Polygon Create/khartoum_airport_news.png'
      },
      leftDates: ['20-2-2023', '17-4-2023', '23-4-2023', '4-5-2024'],
      rightDates: ['20-2-2023', '17-4-2023', '23-4-2023', '4-5-2024'],
      leftImagesMap: {
        '20-2-2023': 'assets/Geo File/Polygon Create/khartoum_airport_20-2-2023.jpg',
        '17-4-2023': 'assets/Geo File/Polygon Create/khartoum_airport_17-4-2023.jpg',
        '23-4-2023': 'assets/Geo File/Polygon Create/khartoum_airport_23-4-2023.jpg',
        '4-5-2024': 'assets/Geo File/Polygon Create/khartoum_airport_4-5-2024.jpg'
      },
      rightImagesMap: {
        '20-2-2023': 'assets/Geo File/Polygon Create/khartoum_airport_20-2-2023.jpg',
        '17-4-2023': 'assets/Geo File/Polygon Create/khartoum_airport_17-4-2023.jpg',
        '23-4-2023': 'assets/Geo File/Polygon Create/khartoum_airport_23-4-2023.jpg',
        '4-5-2024': 'assets/Geo File/Polygon Create/khartoum_airport_4-5-2024.jpg'
      },
      display: {
        news: true,
        dash1: false,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: '100%',
        dashbordHeight: '100%',
        element7Width: '100%',
        timelineHeight: 'auto',
        containerRow2Height: 'auto',
        newsHeight: '140px'
      },
      newsLink: 'https://www.aa.com.tr/en/africa/fire-breaks-out-at-khartoum-airport-amid-sudan-clashes/2876543',
      leftDate: '20-2-2023',
      rightDate: '4-5-2024'
    },
    'Renaissance_Dam': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Renaissance_Dam_11-2013.JPG',
        right: 'assets/Geo File/Polygon Create/Renaissance_Dam_10-2023.JPG',
        news: 'assets/Geo File/Polygon Create/Renaissance_Dam_news.png'
      },
      leftDates: ['11-2013', '1-2016', '10-2020', '11-2020', '3-2022', '10-2023'],
      rightDates: ['11-2013', '1-2016', '10-2020', '11-2020', '3-2022', '10-2023'],
      leftImagesMap: {
        '11-2013': 'assets/Geo File/Polygon Create/Renaissance_Dam_11-2013.JPG',
        '1-2016': 'assets/Geo File/Polygon Create/Renaissance_Dam_1-2016.JPG',
        '10-2020': 'assets/Geo File/Polygon Create/Renaissance_Dam_10-2020.JPG',
        '11-2020': 'assets/Geo File/Polygon Create/Renaissance_Dam_11-2020.JPG',
        '3-2022': 'assets/Geo File/Polygon Create/Renaissance_Dam_3-2022.JPG',
        '10-2023': 'assets/Geo File/Polygon Create/Renaissance_Dam_10-2023.JPG'
      },
      rightImagesMap: {
        '11-2013': 'assets/Geo File/Polygon Create/Renaissance_Dam_11-2013.JPG',
        '1-2016': 'assets/Geo File/Polygon Create/Renaissance_Dam_1-2016.JPG',
        '10-2020': 'assets/Geo File/Polygon Create/Renaissance_Dam_10-2020.JPG',
        '11-2020': 'assets/Geo File/Polygon Create/Renaissance_Dam_11-2020.JPG',
        '3-2022': 'assets/Geo File/Polygon Create/Renaissance_Dam_3-2022.JPG',
        '10-2023': 'assets/Geo File/Polygon Create/Renaissance_Dam_10-2023.JPG'
      },
      display: {
        news: true,
        dash1: false,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: '100%',
        dashbordHeight: '100%',
        element7Width: '100%',
        timelineHeight: 'auto',
        containerRow2Height: 'auto',
        newsHeight: '140px'
      },
      newsLink: 'https://www.water-technology.net/projects/grand-ethiopian-renaissance-dam-africa/',
      leftDate: '11-2013',
      rightDate: '10-2023'
    },
    'Sudan_Border': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Sudan_Border_11-2022.JPG',
        right: 'assets/Geo File/Polygon Create/Sudan_Border_5-2023.JPG',
        news: 'assets/Geo File/Polygon Create/Sudan_Border_news.png'
      },
      leftDates: ['11-2022', '5-2023'],
      rightDates: ['11-2022', '5-2023'],
      leftImagesMap: {
        '11-2022': 'assets/Geo File/Polygon Create/Sudan_Border_11-2022.JPG',
        '5-2023': 'assets/Geo File/Polygon Create/Sudan_Border_5-2023.JPG'
      },
      rightImagesMap: {
        '11-2022': 'assets/Geo File/Polygon Create/Sudan_Border_11-2022.JPG',
        '5-2023': 'assets/Geo File/Polygon Create/Sudan_Border_5-2023.JPG'
      },
      display: {
        news: true,
        dash1: false,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: '100%',
        dashbordHeight: '100%',
        element7Width: '100%',
        timelineHeight: 'auto',
        containerRow2Height: 'auto',
        newsHeight: '140px'
      },
      newsLink: 'https://english.ahram.org.eg/News/498920.aspx',
      leftDate: '11-2022',
      rightDate: '5-2023'
    },
    'Infrastructure_project': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Infrastructure_project_11-2020.jpeg',
        right: 'assets/Geo File/Polygon Create/Infrastructure_project_12-2023.jpeg',
        news: 'assets/Geo File/Polygon Create/Infrastructure_project_news.png',
        dash1: 'assets/Geo File/Polygon Create/Infrastructure_project_parchart.jpeg',
        dash2: 'assets/Geo File/Polygon Create/Infrastructure_project_liner.jpeg'
      },
      leftDates: ['11-2020', '12-2023'],
      rightDates: ['11-2020', '12-2023'],
      leftImagesMap: {
        '11-2020': 'assets/Geo File/Polygon Create/Infrastructure_project_11-2020.jpeg',
        '12-2023': 'assets/Geo File/Polygon Create/Infrastructure_project_12-2023.jpeg'
      },
      rightImagesMap: {
        '11-2020': 'assets/Geo File/Polygon Create/Infrastructure_project_11-2020.jpeg',
        '12-2023': 'assets/Geo File/Polygon Create/Infrastructure_project_12-2023.jpeg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: 'auto'
      },
      newsLink: 'https://feedbackoysg.com/nearly-completed-iseyin-fapote-ogbomoso-road/',
      leftDate: '11-2020',
      rightDate: '12-2023'
    },
    'Libya_Flooding': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Libya_Flooding_6-2023.JPG',
        right: 'assets/Geo File/Polygon Create/Libya_Flooding_9-2023.JPG',
        news: 'assets/Geo File/Polygon Create/Libya_Flooding_news.png',
        dash1: 'assets/Geo File/Polygon Create/Libya_Flooding_barchart1.jpg',
        dash2: 'assets/Geo File/Polygon Create/Libya_Flooding_barchart2.jpg'
      },
      leftDates: ['6-2023', '9-2023'],
      rightDates: ['6-2023', '9-2023'],
      leftImagesMap: {
        '6-2023': 'assets/Geo File/Polygon Create/Libya_Flooding_6-2023.JPG',
        '9-2023': 'assets/Geo File/Polygon Create/Libya_Flooding_9-2023.JPG'
      },
      rightImagesMap: {
        '6-2023': 'assets/Geo File/Polygon Create/Libya_Flooding_6-2023.JPG',
        '9-2023': 'assets/Geo File/Polygon Create/Libya_Flooding_9-2023.JPG'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '49%',
        newsHeight: '135px'
      },
      newsLink: 'https://www.britannica.com/event/Libya-flooding-of-2023',
      leftDate: '6-2023',
      rightDate: '9-2023'
    },
    'Land_Use': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Libya_satelliteImage1.jpg',
        right: 'assets/Geo File/Polygon Create/Land-use-image1.jpg',
        news: 'assets/Geo File/Polygon Create/Screenshot.png',
        dash1: 'assets/Geo File/Polygon Create/Land-use-barchart1.jpg',
        dash2: 'assets/Geo File/Polygon Create/Land-use-barchart2.jpg'
      },
      leftDates: ['satellite Image', 'Land Use'],
      rightDates: ['satellite Image', 'Land Use'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Libya_satelliteImage1.jpg',
        'Land Use': 'assets/Geo File/Polygon Create/Land-use-image1.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Libya_satelliteImage1.jpg',
        'Land Use': 'assets/Geo File/Polygon Create/Land-use-image1.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'Land Use'
    },
    '1': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/fayhan1.jpg',
        right: 'assets/Geo File/Polygon Create/fayhan2.jpg',
        dash1: 'assets/Geo File/Polygon Create/fayhan3.jpg'
      },
      leftDates: ['satellite Image', 'After Detection'],
      rightDates: ['satellite Image', 'After Detection'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/fayhan1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/fayhan2.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/fayhan1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/fayhan2.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'After Detection'
    },
    '2': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/abdelaziz1.jpg',
        right: 'assets/Geo File/Polygon Create/abdelaziz2.jpg',
        dash1: 'assets/Geo File/Polygon Create/abdelaziz3.jpg'
      },
      leftDates: ['satellite Image', 'After Detection'],
      rightDates: ['satellite Image', 'After Detection'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/abdelaziz1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/abdelaziz2.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/abdelaziz1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/abdelaziz2.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'After Detection'
    },
    '3': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Palm_id1_1.jpg',
        right: 'assets/Geo File/Polygon Create/Palm_id1_2.jpg',
        dash1: 'assets/Geo File/Polygon Create/Palm_id1_3.jpg'
      },
      leftDates: ['satellite Image', 'After Detection'],
      rightDates: ['satellite Image', 'After Detection'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id1_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id1_2.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id1_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id1_2.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'After Detection'
    },
    '4': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Palm_id2_1.jpg',
        right: 'assets/Geo File/Polygon Create/Palm_id2_2.jpg',
        dash1: 'assets/Geo File/Polygon Create/Palm_id2_3.jpg'
      },
      leftDates: ['satellite Image', 'After Detection'],
      rightDates: ['satellite Image', 'After Detection'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id2_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id2_2.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id2_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id2_2.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'After Detection'
    },
    '5': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Palm_id3_1.jpg',
        right: 'assets/Geo File/Polygon Create/Palm_id3_2.jpg',
        dash1: 'assets/Geo File/Polygon Create/Palm_id3_3.jpg'
      },
      leftDates: ['satellite Image', 'After Detection'],
      rightDates: ['satellite Image', 'After Detection'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id3_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id3_2.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id3_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id3_2.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'After Detection'
    },
    '6': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Palm_id4_1.jpg',
        right: 'assets/Geo File/Polygon Create/Palm_id4_2.jpg',
        dash1: 'assets/Geo File/Polygon Create/Palm_id4_3.jpg'
      },
      leftDates: ['satellite Image', 'After Detection'],
      rightDates: ['satellite Image', 'After Detection'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id4_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id4_2.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id4_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id4_2.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'After Detection'
    },
    '7': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Palm_id5_1.jpg',
        right: 'assets/Geo File/Polygon Create/Palm_id5_2.jpg',
        dash1: 'assets/Geo File/Polygon Create/Palm_id5_3.jpg'
      },
      leftDates: ['satellite Image', 'After Detection'],
      rightDates: ['satellite Image', 'After Detection'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id5_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id5_2.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id5_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id5_2.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'After Detection'
    },
    '8': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Palm_id6_1.jpg',
        right: 'assets/Geo File/Polygon Create/Palm_id6_2.jpg',
        dash1: 'assets/Geo File/Polygon Create/Palm_id6_3.jpg'
      },
      leftDates: ['satellite Image', 'After Detection'],
      rightDates: ['satellite Image', 'After Detection'],
      leftImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id6_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id6_2.jpg'
      },
      rightImagesMap: {
        'satellite Image': 'assets/Geo File/Polygon Create/Palm_id6_1.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id6_2.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'satellite Image',
      rightDate: 'After Detection'
    },
    '9': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Palm_id9_10-2023.jpg',
        right: 'assets/Geo File/Polygon Create/Palm_id9_After Detection.jpg',
        dash1: 'assets/Geo File/Polygon Create/Palm_id9_3.jpg'
      },
      leftDates: ['10-2023', 'After Detection'],
      rightDates: ['10-2023', 'After Detection'],
      leftImagesMap: {
        '10-2023': 'assets/Geo File/Polygon Create/Palm_id9_10-2023.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id9_After Detection.jpg'
      },
      rightImagesMap: {
        '10-2023': 'assets/Geo File/Polygon Create/Palm_id9_10-2023.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id9_After Detection.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: '10-2023',
      rightDate: 'After Detection'
    },
    '10': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Palm_id10_3-2023.jpg',
        right: 'assets/Geo File/Polygon Create/Palm_id10_After Detection.jpg',
        dash1: 'assets/Geo File/Polygon Create/Palm_id10_3.jpg'
      },
      leftDates: ['3-2023', 'After Detection'],
      rightDates: ['3-2023', 'After Detection'],
      leftImagesMap: {
        '3-2023': 'assets/Geo File/Polygon Create/Palm_id10_3-2023.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id10_After Detection.jpg'
      },
      rightImagesMap: {
        '3-2023': 'assets/Geo File/Polygon Create/Palm_id10_3-2023.jpg',
        'After Detection': 'assets/Geo File/Polygon Create/Palm_id10_After Detection.jpg'
      },
      display: {
        news: false,
        dash1: true,
        dash2: false,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '100%',
        containerRow2Height: '0%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: '3-2023',
      rightDate: 'After Detection'
    },
    'Azuri_Towers_Nigeria': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-5-2016.jpg',
        right: 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-2-2024.jpg',
        news: 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-new.png',
        dash1: 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-barchart.jpg',
        dash2: 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-pointchart.jpg'
      },
      leftDates: ['5-2016', '2-2018', '12-2018', '1-2020', '2-2024'],
      rightDates: ['5-2016', '2-2018', '12-2018', '1-2020', '2-2024'],
      leftImagesMap: {
        '5-2016': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-5-2016.jpg',
        '2-2018': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-2-2018.jpg',
        '12-2018': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-12-2018.jpg',
        '1-2020': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-1-2020.jpg',
        '2-2024': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-2-2024.jpg'
      },
      rightImagesMap: {
        '5-2016': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-5-2016.jpg',
        '2-2018': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-2-2018.jpg',
        '12-2018': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-12-2018.jpg',
        '1-2020': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-1-2020.jpg',
        '2-2024': 'assets/Geo File/Polygon Create/Azuri_Towers_Nigeria-2-2024.jpg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: 'auto'
      },
      newsLink: 'https://www.itbng.com/azuri-peninsula-eko-atlantic-city-lagos',
      leftDate: '5-2016',
      rightDate: '2-2024'
    },
    'TATU_CITY_KENYA': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-12-2017.jpg',
        right: 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-2-2024.jpg',
        news: 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-News.jpg',
        dash1: 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-Barchart.jpg',
        dash2: 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-pointchart.jpg'
      },
      leftDates: ['12-2017', '1-2019', '1-2020', '2-2021', '1-2023', '2-2024'],
      rightDates: ['12-2017', '1-2019', '1-2020', '2-2021', '1-2023', '2-2024'],
      leftImagesMap: {
        '12-2017': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-12-2017.jpg',
        '1-2019': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-1-2019.jpg',
        '1-2020': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-1-2020.jpg',
        '2-2021': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-2-2021.jpg',
        '1-2023': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-1-2023.jpg',
        '2-2024': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-2-2024.jpg'
      },
      rightImagesMap: {
        '12-2017': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-12-2017.jpg',
        '1-2019': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-1-2019.jpg',
        '1-2020': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-1-2020.jpg',
        '2-2021': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-2-2021.jpg',
        '1-2023': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-1-2023.jpg',
        '2-2024': 'assets/Geo File/Polygon Create/TATU_CITY_KENYA-2-2024.jpg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: '135px'
      },
      newsLink: 'https://nellions.co.ke/blog/upcoming-residential-estates-nairobi/#9-Tatu-City',
      leftDate: '12-2017',
      rightDate: '2-2024'
    },
    'Mining_Monitoring': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Mining_Monitoring-7-2013.jpg',
        right: 'assets/Geo File/Polygon Create/Mining_Monitoring-6-2022.jpg',
        news: 'assets/Geo File/Polygon Create/Mining_Monitoring_news.jpg',
        dash1: 'assets/Geo File/Polygon Create/Mining_Monitoring-barchart.jpg',
        dash2: 'assets/Geo File/Polygon Create/Mining_Monitoring-circalchart.jpg'
      },
      leftDates: ['7-2013', '6-2014', '10-2017', '6-2020', '6-2022'],
      rightDates: ['7-2013', '6-2014', '10-2017', '6-2020', '6-2022'],
      leftImagesMap: {
        '7-2013': 'assets/Geo File/Polygon Create/Mining_Monitoring-7-2013.jpg',
        '6-2014': 'assets/Geo File/Polygon Create/Mining_Monitoring-6-2014.jpg',
        '10-2017': 'assets/Geo File/Polygon Create/Mining_Monitoring-10-2017.jpg',
        '6-2020': 'assets/Geo File/Polygon Create/Mining_Monitoring-6-2020.jpg',
        '6-2022': 'assets/Geo File/Polygon Create/Mining_Monitoring-6-2022.jpg'
      },
      rightImagesMap: {
        '7-2013': 'assets/Geo File/Polygon Create/Mining_Monitoring-7-2013.jpg',
        '6-2014': 'assets/Geo File/Polygon Create/Mining_Monitoring-6-2014.jpg',
        '10-2017': 'assets/Geo File/Polygon Create/Mining_Monitoring-10-2017.jpg',
        '6-2020': 'assets/Geo File/Polygon Create/Mining_Monitoring-6-2020.jpg',
        '6-2022': 'assets/Geo File/Polygon Create/Mining_Monitoring-6-2022.jpg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: '130px'
      },
      newsLink: 'https://www.digest.tz/ongoing-struggle-with-small-scale-mining-threating-environment/',
      leftDate: '07-2013',
      rightDate: '06-2022'
    },
    'Oil_Spill_Detection': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Oil_Spill_27-7-2021.JPG',
        right: 'assets/Geo File/Polygon Create/Oil_Spill_26-8-2021.JPG',
        news: 'assets/Geo File/Polygon Create/Oil_Spill_Detection-news.jpg',
        dash1: 'assets/Geo File/Polygon Create/Oil_Spill_Detection-parchart.jpg',
        dash2: 'assets/Geo File/Polygon Create/Oil_Spill_Detection-pointchart.jpg'
      },
      leftDates: ['27-7-2021', '1-8-2021', '6-8-2021', '11-8-2021', '16-8-2021', '21-8-2021', '26-8-2021'],
      rightDates: ['27-7-2021', '1-8-2021', '6-8-2021', '11-8-2021', '16-8-2021', '21-8-2021', '26-8-2021'],
      leftImagesMap: {
        '27-7-2021': 'assets/Geo File/Polygon Create/Oil_Spill_27-7-2021.JPG',
        '1-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_1-8-2021.JPG',
        '6-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_6-8-2021.JPG',
        '11-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_11-8-2021.JPG',
        '16-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_16-8-2021.JPG',
        '21-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_21-8-2021.JPG',
        '26-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_26-8-2021.JPG'
      },
      rightImagesMap: {
        '27-7-2021': 'assets/Geo File/Polygon Create/Oil_Spill_27-7-2021.JPG',
        '1-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_1-8-2021.JPG',
        '6-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_6-8-2021.JPG',
        '11-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_11-8-2021.JPG',
        '16-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_16-8-2021.JPG',
        '21-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_21-8-2021.JPG',
        '26-8-2021': 'assets/Geo File/Polygon Create/Oil_Spill_26-8-2021.JPG'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '48.2%',
        newsHeight: '130px'
      },
      newsLink: 'https://www.egypttoday.com/Article/1/106225/Egyptian-El-Monakh-beach-in-Port-Said-cleaned-up-from',
      leftDate: '27-7-2021',
      rightDate: '26-8-2021'
    },
    'Wildfires': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Wildfires-23-7-2023.jpg',
        right: 'assets/Geo File/Polygon Create/Wildfires-29-3-2024.jpg',
        news: 'assets/Geo File/Polygon Create/Wildfires-News.jpg',
        dash1: 'assets/Geo File/Polygon Create/Wildfires-barchart.jpg',
        dash2: 'assets/Geo File/Polygon Create/Wildfires-saidebarchart.jpg'
      },
      leftDates: ['23-7-2023', '11-10-2023', '30-11-2023', '29-3-2024'],
      rightDates: ['23-7-2023', '11-10-2023', '30-11-2023', '29-3-2024'],
      leftImagesMap: {
        '23-7-2023': 'assets/Geo File/Polygon Create/Wildfires-23-7-2023.jpg',
        '11-10-2023': 'assets/Geo File/Polygon Create/Wildfires-11-10-2023.jpg',
        '30-11-2023': 'assets/Geo File/Polygon Create/Wildfires-30-11-2023.jpg',
        '29-3-2024': 'assets/Geo File/Polygon Create/Wildfires-29-3-2024.jpg'
      },
      rightImagesMap: {
        '23-7-2023': 'assets/Geo File/Polygon Create/Wildfires-23-7-2023.jpg',
        '11-10-2023': 'assets/Geo File/Polygon Create/Wildfires-11-10-2023.jpg',
        '30-11-2023': 'assets/Geo File/Polygon Create/Wildfires-30-11-2023.jpg',
        '29-3-2024': 'assets/Geo File/Polygon Create/Wildfires-29-3-2024.jpg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: '130px'
      },
      newsLink: 'https://www.thenationalnews.com/world/2023/07/26/horrors-of-wildfires-from-space-satellite-photos-track-blazes-in-europe-and-north-africa/',
      leftDate: '23-7-2023',
      rightDate: '29-3-2024'
    },
    'Crop_Disease_Detection': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Crop_Disease_Detection_Satellite-image.jpg',
        right: 'assets/Geo File/Polygon Create/Crop_Disease_Detection.jpg',
        news: 'assets/Geo File/Polygon Create/Crop_Disease_Detection-News.jpg',
        dash1: 'assets/Geo File/Polygon Create/Crop_Disease_Detection-Circelchart.jpg',
        dash2: 'assets/Geo File/Polygon Create/Crop_Disease_Detection-Linechart.jpg'
      },
      leftDates: ['Satellite Image', 'Crop Disease Detection'],
      rightDates: ['Satellite Image', 'Crop Disease Detection'],
      leftImagesMap: {
        'Satellite Image': 'assets/Geo File/Polygon Create/Crop_Disease_Detection_Satellite-image.jpg',
        'Crop Disease Detection': 'assets/Geo File/Polygon Create/Crop_Disease_Detection.jpg'
      },
      rightImagesMap: {
        'Satellite Image': 'assets/Geo File/Polygon Create/Crop_Disease_Detection_Satellite-image.jpg',
        'Crop Disease Detection': 'assets/Geo File/Polygon Create/Crop_Disease_Detection.jpg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: '135px'
      },
      newsLink: 'https://www.downtoearth.org.in/news/agriculture/savage-mode-in-a-warmer-wetter-world-pests-are-multiplying-faster-and-damaging-crops-severely-91049',
      leftDate: 'Satellite Image',
      rightDate: 'Crop Disease Detection'
    },
    'Crop_Health': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Crop_Health-11-3-2023.jpg',
        right: 'assets/Geo File/Polygon Create/Crop_Health-11-3-2023 NDVI.jpg',
        news: 'assets/Geo File/Polygon Create/Crop_Health-News.jpg',
        dash1: 'assets/Geo File/Polygon Create/Crop_Health-Digram1.jpg',
        dash2: 'assets/Geo File/Polygon Create/Crop_Health-Digram2.jpg'
      },
      leftDates: ['21-5-2022', '21-5-2022 NDVI', '11-3-2023', '11-3-2023 NDVI'],
      rightDates: ['21-5-2022', '21-5-2022 NDVI', '11-3-2023', '11-3-2023 NDVI'],
      leftImagesMap: {
        '21-5-2022': 'assets/Geo File/Polygon Create/Crop_Health-21-5-2022.jpg',
        '21-5-2022 NDVI': 'assets/Geo File/Polygon Create/Crop_Health-21-5-2022 NDVI.jpg',
        '11-3-2023': 'assets/Geo File/Polygon Create/Crop_Health-11-3-2023.jpg',
        '11-3-2023 NDVI': 'assets/Geo File/Polygon Create/Crop_Health-11-3-2023 NDVI.jpg'
      },
      rightImagesMap: {
        '21-5-2022': 'assets/Geo File/Polygon Create/Crop_Health-21-5-2022.jpg',
        '21-5-2022 NDVI': 'assets/Geo File/Polygon Create/Crop_Health-21-5-2022 NDVI.jpg',
        '11-3-2023': 'assets/Geo File/Polygon Create/Crop_Health-11-3-2023.jpg',
        '11-3-2023 NDVI': 'assets/Geo File/Polygon Create/Crop_Health-11-3-2023 NDVI.jpg'
      },
      display: {
        news: true,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '49%',
        newsHeight: '135px'
      },
      newsLink: 'https://www.usaid.gov/kenya/agriculture-food-and-water-security',
      leftDate: '11-3-2023',
      rightDate: '11-3-2023 NDVI'
    },
    'Crop_Classification': {
      showDashboard: true,
      showVideo: false,
      images: {
        left: 'assets/Geo File/Polygon Create/Crop_Classification_satelliteImage.jpg',
        right: 'assets/Geo File/Polygon Create/Crop_Classification_Classification.png',
        dash1: 'assets/Geo File/Polygon Create/Crop_Classification_parchart.jpg',
        dash2: 'assets/Geo File/Polygon Create/Crop_Classification_piechart.jpg'
      },
      leftDates: ['Satellite Image', 'Classification'],
      rightDates: ['Satellite Image', 'Classification'],
      leftImagesMap: {
        'Satellite Image': 'assets/Geo File/Polygon Create/Crop_Classification_satelliteImage.jpg',
        'Classification': 'assets/Geo File/Polygon Create/Crop_Classification_Classification.png'
      },
      rightImagesMap: {
        'Satellite Image': 'assets/Geo File/Polygon Create/Crop_Classification_satelliteImage.jpg',
        'Classification': 'assets/Geo File/Polygon Create/Crop_Classification_Classification.png'
      },
      display: {
        news: false,
        dash1: true,
        dash2: true,
        dash3: false,
        element6: false
      },
      styles: {
        dashbordWidth: null,
        dashbordHeight: null,
        element7Width: '100%',
        timelineHeight: '50%',
        containerRow2Height: '50%',
        newsHeight: 'auto'
      },
      newsLink: '',
      leftDate: 'Satellite Image',
      rightDate: 'Classification'
    }
  };

  currentLayerConfig: any = null;

  constructor(
    private mapControl: MapControlService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.username = this.authService.getUsername();
  }

  ngOnInit() {
    this.activeSidebarIndex = 1;
  }

  ngAfterViewInit() {
    // سيتم استدعاء initSlider عند فتح الـ popup
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

  setActiveSidebar(idx: number) {
    if (idx === 2) {
      if (this.showDetectionMenu) {
        this.showDetectionMenu = false;
        this.activeSidebarIndex = 1;
        this.lastClickedSidebarIndex = 1;
      } else {
        this.activeSidebarIndex = 2;
        this.lastClickedSidebarIndex = 2;
        this.showDetectionMenu = true;
        this.showProfileMenu = false;
      }
    } else if (idx === 1) {
      this.activeSidebarIndex = 1;
      this.lastClickedSidebarIndex = 1;
      this.showDetectionMenu = false;
      this.showProfileMenu = false;
      this.closeSubmenu();
      this.mapControl.resetMapToDefault();
    } else {
      this.activeSidebarIndex = idx;
      this.lastClickedSidebarIndex = idx;
      this.showDetectionMenu = false;
      this.showProfileMenu = false;
      this.closeSubmenu();
    }
  }

  onSidebarLayerClick(layerName: string) {
    this.mapControl.showLayer(layerName);
    this.closeSubmenu(); // لإغلاق القوائم المنبثقة بعد الضغط (اختياري)
    this.hideDetectionMenu(); // إخفاء القائمة الرئيسية بعد اختيار عنصر
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
    console.log('onPolygonSelected called with layer:', event.layer);
    console.log('Available layers:', Object.keys(this.layersConfig));
    
    this.currentLayerConfig = this.layersConfig[event.layer] || null;
    console.log('Current layer config set to:', this.currentLayerConfig);
    
    this.popupData = this.currentLayerConfig;
    this.sliderX = 250;
    
    // Initialize slider after popup is shown
    setTimeout(() => {
      this.initSlider();
      // this.initializeSelectButtons(); // Reinitialize select buttons for new popup
    }, 100);
  }
  
  closePopup() { 
    this.currentLayerConfig = null;
    this.popupData = null;
  }
  
  toggleLeftDates() {
    console.log('toggleLeftDates called');
    console.log('Current showLeftDates:', this.showLeftDates);
    console.log('Current layer config:', this.currentLayerConfig);
    console.log('Left dates available:', this.currentLayerConfig?.leftDates);
    
    this.showLeftDates = !this.showLeftDates;
    this.showRightDates = false;
    
    console.log('New showLeftDates:', this.showLeftDates);
  }
  
  toggleRightDates() {
    console.log('toggleRightDates called');
    console.log('Current showRightDates:', this.showRightDates);
    console.log('Current layer config:', this.currentLayerConfig);
    console.log('Right dates available:', this.currentLayerConfig?.rightDates);
    
    this.showRightDates = !this.showRightDates;
    this.showLeftDates = false;
    
    console.log('New showRightDates:', this.showRightDates);
  }
  
  selectLeftDate(date: string) {
    console.log('selectLeftDate called with:', date);
    if (this.currentLayerConfig) {
      this.currentLayerConfig.leftDate = date;
      this.showLeftDates = false;
      
      // Update the left image if we have a mapping for the current layer
      if (this.currentLayerConfig.leftImagesMap && this.currentLayerConfig.leftImagesMap[date]) {
        console.log('Updating left image to:', this.currentLayerConfig.leftImagesMap[date]);
        // Update the currentLayerConfig.images.left for consistency
        this.currentLayerConfig.images.left = this.currentLayerConfig.leftImagesMap[date];
        // Force Angular to detect changes
        this.cdr.detectChanges();
      }
    }
  }
  
  selectRightDate(date: string) {
    console.log('selectRightDate called with:', date);
    if (this.currentLayerConfig) {
      this.currentLayerConfig.rightDate = date;
      this.showRightDates = false;
      
      // Update the right image if we have a mapping for the current layer
      if (this.currentLayerConfig.rightImagesMap && this.currentLayerConfig.rightImagesMap[date]) {
        console.log('Updating right image to:', this.currentLayerConfig.rightImagesMap[date]);
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
    
    // Handle dropdown and dialog clicks - only if dialog is already open
    if (this.currentLayerConfig) {
      const dialogElement = document.getElementById('dialog_detect');
      const mapElement = document.getElementById('map_section');
      const sidebarElement = document.querySelector('.Side_bar');
      
      // Check if click is on dropdown buttons - don't close if it is
      if (target.closest('.select-btn') || target.closest('.select-btn1')) {
        return;
      }
      
      // Close dropdowns
      this.showLeftDates = false;
      this.showRightDates = false;
      
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
    
    // Only handle if dialog is open and click is on map
    if (this.currentLayerConfig && mapElement && dialogElement && mapElement.contains(target)) {
      // If clicking on map but not on dialog, close dialog
      if (!dialogElement.contains(target)) {
        // Small delay to allow polygon click events to process first
        setTimeout(() => {
          if (this.currentLayerConfig && document.getElementById('dialog_detect')) {
            this.closePopup();
          }
        }, 50);
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
}
