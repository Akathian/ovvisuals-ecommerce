import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import * as fbAdmin from 'firebase-admin'
@Injectable({
  providedIn: 'root'
})
export class AdminCheckService {

  openOrders;
  numOpenOrders = 0;
  numOpenOrderUsers = 0;
  fullOpenOrderObj;
  allOrders;
  constructor() { }
  getInfo() {
    this.getOpenOrders()
  }
  getOpenOrders() {
    let self = this
    firebase.database().ref('Admin/Open-orders').on('value', function (openOrderData) {
      self.openOrders = openOrderData.val()
      self.numOpenOrderUsers = Object.keys(self.openOrders).length
      self.numOpenOrders = 0
      let all = {}
      for (let user of Object.entries(self.openOrders)) {
        self.numOpenOrders += Object.keys(user[1]).length
        // self.allOrders.concat(Object.)
        for (let order of Object.entries(user[1])) {
          order[1].user = user[0]
          all[order[0]] = order[1]
        }
      }
      self.allOrders = all
      self.openOrders = Object.entries(self.openOrders)
      self.fullOpenOrderObj = openOrderData.val()
    })
  }

}
