import { Component, OnInit } from '@angular/core';
import { AdminCheckService } from '../../../services/admin-check.service'
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {

  constructor(private admin: AdminCheckService) { }
  orders = []
  once = false
  itemNum = 0
  total = 0;
  ngOnInit() {
    this.getAll()
  }

  getAll() {
    let self = this
    firebase.database().ref('Admin/Accounting/').on('value', function (accData) {
      let userOrders = Object.entries(accData.val())
      for (let user of userOrders) {
        let orders = Object.keys(user[1])
        for (let time of orders) {
          user[1][time].time = time
          user[1][time]
          self.orders.push(user[1][time])
        }
      }
      self.orders.sort((a, b) => {
        if (a.time > b.time) {
          return -1
        } else if (a.time < b.time) {
          return 1
        }
        return 0
      })
      for (let i = 0; i < self.orders.length; i++) {
        self.orders[i].num = self.orders.length - i
        self.orders[i].name = self.orders[i].name.split(" ")[0]
        let d = new Date()
        d.setTime(+(self.orders[i].time))
        self.orders[i].time = d.toDateString()
        self.total += self.orders[i].total
      }
      console.log(self.orders)
    })
  }
}
