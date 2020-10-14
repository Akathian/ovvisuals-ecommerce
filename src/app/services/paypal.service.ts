import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/functions';

@Injectable({
  providedIn: 'root',
})
export class PaypalService {
  constructor() {
    //
  }

  giveTracking(tid, tracking, carrier, carrier_other, status) {
    const data = {
      tid,
      tracking,
      carrier,
      carrier_other,
      status,
    };
    const paypalTrack = firebase.functions().httpsCallable('paypalTracking');
    paypalTrack(data).then((res) => {
      console.log(res.data);
    });
  }
}
