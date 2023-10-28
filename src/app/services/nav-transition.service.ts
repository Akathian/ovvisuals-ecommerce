import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class NavTransitionService {
  transitioned: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }
}
