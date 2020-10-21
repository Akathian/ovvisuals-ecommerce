import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'ovvisuals-ecommerce';
  counting = false;

  constructor() {
    const self = this;
    firebase
      .database()
      .ref('switch')
      .on('value', function (switchData) {
        console.log();
        self.counting = !switchData.val();
      });
  }
  ngOnInit() {}
}
