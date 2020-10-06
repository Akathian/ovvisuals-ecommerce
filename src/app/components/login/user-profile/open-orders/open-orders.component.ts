import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {
  @Input() user;
  openOrders;
  cat;
  requests;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.cat = params.get('cat');
      this.cat = this.cat.charAt(0).toUpperCase() + this.cat.slice(1);
      this.getOpenOrders()
    });

  }

  getOpenOrders() {
    let self = this
    self.openOrders = null
    firebase.database().ref("Users/" + self.user.uid + "/" + self.cat).on('value', function (orderData) {
      self.openOrders = Object.entries(orderData.val())
      self.openOrders = self.openOrders.reverse()
    })
    self.requests = null
    firebase.database().ref("Users/" + self.user.uid + "/" + self.cat + "-custom").on('value', function (customData) {
      console.log(self.cat + "-custom")
      self.requests = Object.entries(customData.val())
      self.requests = self.requests.reverse()
    })
  }

}
