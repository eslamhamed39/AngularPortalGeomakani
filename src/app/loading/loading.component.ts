import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Input() show: boolean = true;
  @Input() mapLoaded: boolean = false;
  
  private timeoutId: any;

  ngOnInit() {
    // إذا لم يتم تحميل الخريطة بعد، انتظر
    if (!this.mapLoaded) {
      this.show = true;
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onMapLoaded() {
    // انتظر ثانيتين إضافيتين بعد تحميل الخريطة
    this.timeoutId = setTimeout(() => {
      this.show = false;
    }, 2000);
  }
}
