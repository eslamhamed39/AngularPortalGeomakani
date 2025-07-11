import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapControlService {
  private layerSubject = new BehaviorSubject<string>('');
  layer$ = this.layerSubject.asObservable();

  private resetMapSubject = new Subject<void>();
  resetMap$ = this.resetMapSubject.asObservable();

  showLayer(layer: string) {
    this.layerSubject.next(layer);
  }

  resetMapToDefault() {
    this.resetMapSubject.next();
  }
}
