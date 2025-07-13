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
    // If map is not loaded yet, wait
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
    // Wait two additional seconds after map loads
    this.timeoutId = setTimeout(() => {
      this.show = false;
    }, 2000);
  }
}
