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

  intermediate_orders = {
    orders: {},
    numOrders: 0,
    numUsers: 0,
    fullObj: {},
    allOrders: {},
  }

  complete_orders = {
    orders: {},
    numOrders: 0,
    numUsers: 0,
    fullObj: {},
    allOrders: {},
    completedAt: 0
  }

  constructor() { }
  getInfo() {
    try {
      this.getOpenOrders()
      this.getIntermediateOrders()
      this.getCompleteOrders()
    } catch (e) { }
  }

  getOpenOrders() {
    let self = this
    firebase.database().ref('Admin/Open-orders').on('value', function (openOrderData) {
      try {
        self.open_orders.orders = openOrderData.val()
        self.open_orders.numUsers = Object.keys(self.open_orders.orders).length
        self.open_orders.numOrders = 0
        let all = {}
        for (let user of Object.entries(self.open_orders.orders)) {
          self.open_orders.numOrders += Object.keys(user[1]).length
          for (let order of Object.entries(user[1])) {
            order[1].user = user[0]
            all[order[0]] = order[1]
          }
        }
        self.open_orders.allOrders = all
        self.open_orders.orders = Object.entries(self.open_orders.orders)
        self.open_orders.fullObj = openOrderData.val()
      } catch (e) { }
    })
  }

  getIntermediateOrders() {
    let self = this
    firebase.database().ref('Admin/Intermediate-orders').on('value', function (interOrderData) {
      try {
        self.intermediate_orders.orders = interOrderData.val()
        self.intermediate_orders.numUsers = Object.keys(self.intermediate_orders.orders).length
        self.intermediate_orders.numOrders = 0
        let all = {}
        for (let user of Object.entries(self.intermediate_orders.orders)) {
          self.intermediate_orders.numOrders += Object.keys(user[1]).length
          for (let order of Object.entries(user[1])) {
            order[1].user = user[0]
            all[order[0]] = order[1]
          }
        }
        self.intermediate_orders.allOrders = all
        self.intermediate_orders.orders = Object.entries(self.intermediate_orders.orders)
        self.intermediate_orders.fullObj = interOrderData.val()
      } catch (e) { }
    })
  }

  getCompleteOrders() {
    let self = this
    firebase.database().ref('Admin/Complete-orders').on('value', function (completeOrderData) {
      self.complete_orders.orders = completeOrderData.val()
      self.complete_orders.numUsers = Object.keys(self.complete_orders.orders).length
      self.complete_orders.numOrders = 0
      let all = {}
      for (let user of Object.entries(self.complete_orders.orders)) {
        self.complete_orders.numOrders += Object.keys(user[1]).length
        for (let order of Object.entries(user[1])) {
          order[1].user = user[0]
          all[order[0]] = order[1]
        }
      }
      self.complete_orders.allOrders = all
      self.complete_orders.orders = Object.entries(self.complete_orders.orders)
      self.complete_orders.fullObj = completeOrderData.val()
    })
  }

}
