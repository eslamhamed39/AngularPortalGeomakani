import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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

}
