import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import * as fbAdmin from 'firebase-admin'
@Injectable({
  providedIn: 'root'
})
export class AdminCheckService {

  open_orders = {
    orders: {},
    numOrders: 0,
    numUsers: 0,
    fullObj: {},
    allOrders: {},
  }
  openOrders;
  numOpenOrders = 0;
  numOpenOrderUsers = 0;
  fullOpenOrderObj;
  allOpenOrders;
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
        for (let order of Object.entries(user[1])) {
          order[1].user = user[0]
          all[order[0]] = order[1]
        }
      }
      self.allOpenOrders = all
      self.openOrders = Object.entries(self.openOrders)
      self.fullOpenOrderObj = openOrderData.val()
    })
  }

}
