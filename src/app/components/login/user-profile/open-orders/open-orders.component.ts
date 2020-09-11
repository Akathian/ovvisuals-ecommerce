import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {
  @Input() user;
  openOrders;
  constructor() { }

  ngOnInit() {
    this.getOpenOrders()

  }

  getOpenOrders() {
    let self = this
    firebase.database().ref("Users/" + self.user.uid + "/Open-orders").on('value', function (orderData) {
      self.openOrders = Object.entries(orderData.val())
      self.openOrders = self.openOrders.reverse()
    })
  }

}
