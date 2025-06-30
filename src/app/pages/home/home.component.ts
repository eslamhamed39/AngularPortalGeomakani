import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  showDetectionMenu = false;
  activeSidebarIndex = 1; // أول أيقونة (home) مفعلة افتراضياً
  submenuOpen: string | null = null;

  toggleDetectionMenu() {
    this.showDetectionMenu = !this.showDetectionMenu;
  }

  setActiveSidebar(idx: number) {
    this.activeSidebarIndex = idx;
    // أغلق القوائم الجانبية إذا كانت مفتوحة (اختياري)
    if(idx !== 2) this.showDetectionMenu = false;
  }


  openSubmenu(menuName: string) {
    this.submenuOpen = menuName;
  }
  closeSubmenu() {
    this.submenuOpen = null;
  }

  ngAfterViewInit(): void {
    // تأكد أن الكود لا يعمل إلا مرة واحدة فقط
    const map = L.map('map').setView([24.7136, 46.6753], 6); // موقع افتراضي (الرياض)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // إذا أردت أي Marker:
    // L.marker([24.7136, 46.6753]).addTo(map).bindPopup('الرياض').openPopup();
  }

}
