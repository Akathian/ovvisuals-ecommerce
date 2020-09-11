import { Component, OnInit, Input } from '@angular/core';
import { AdminCheckService } from '../../../../../services/admin-check.service'
@Component({
  selector: 'app-order-admin',
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.scss']
})
export class OrderAdminComponent implements OnInit {
  @Input() uid;
  orders;
  times = 0;
  constructor(private admin: AdminCheckService) { }

  ngOnInit() {
    this.times = 0;
  }

  getOrdersByUid(uid) {
    if (!this.times) {
      if (uid != "all") {
        this.orders = Object.entries(this.admin.fullOpenOrderObj[uid])
      } else {
        this.orders = Object.entries(this.admin.allOrders).sort(
          function (a, b) {
            let c: number
            c = +(b[0]) - +(a[0])
            return c
          }
        )
      }
      this.times++;
    }
  }

  sortAll(event) {
    let sortFn;
    let self = this
    let aTime, aShip, aDay, bTime, bShip, bDay
    switch (event) {
      case "1": {
        sortFn = (a, b) => {
          let c: number
          c = +(b[0]) - +(a[0])
          return c
        }
        break;
      }
      case "2": {
        sortFn = (a, b) => {
          let c: number
          c = +(a[0]) - +(b[0])
          return c
        }
        break;
      }
      case "3": {
        sortFn = (a, b) => {
          let c: number
          aTime = +(a[0])
          bTime = +(b[0])
          aShip = a[1].shipMethod
          bShip = b[1].shipMethod
          aDay = self.getPromiseDate(aTime, aShip)
          bDay = self.getPromiseDate(bTime, bShip)
          c = aDay - bDay
          return c
        }
        break;
      }
      case "4": {
        sortFn = (a, b) => {
          let c: number
          aTime = +(a[0])
          bTime = +(b[0])
          aShip = a[1].shipMethod
          bShip = b[1].shipMethod
          aDay = self.getPromiseDate(aTime, aShip)
          bDay = self.getPromiseDate(bTime, bShip)
          c = bDay - aDay
          return c
        }
        break;
      }
    }

    if (this.uid != "all") {
      this.orders = Object.entries(this.admin.fullOpenOrderObj[this.uid]).sort(sortFn)
    } else {
      this.orders = Object.entries(this.admin.allOrders).sort(sortFn)
    }

  }

  getPromiseDate(time, ship) {
    let date = new Date(time)
    let promiseDate;
    switch (ship) {
      case "1": {
        promiseDate = this.addWorkDays(date, 12, 6).getTime();
        break;
      }
      case "2": {
        promiseDate = this.addWorkDays(date, 12, 5).getTime();
        break;
      }
      case "3": {
        promiseDate = this.addWorkDays(date, 10, null).getTime();

        break;
      }
      case "4": {
        promiseDate = this.addWorkDays(date, 6, null).getTime();
        break;
      }
    }
    return promiseDate;
  }

  addWorkDays(startDate, days, roundToDay) {
    if (isNaN(days)) {
      return
    }
    if (!(startDate instanceof Date)) {
      return
    }
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
    var dow = startDate.getDay();
    var daysToAdd = parseInt(days);
    // If the current day is Sunday add one day
    if (dow == 0)
      daysToAdd++;
    // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
    if (dow + daysToAdd >= 6) {
      //Subtract days in current working week from work days
      var remainingWorkDays = daysToAdd - (5 - dow);
      //Add current working week's weekend
      daysToAdd += 2;
      if (remainingWorkDays > 5) {
        //Add two days for each working week by calculating how many weeks are included
        daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
        //Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
        if (remainingWorkDays % 5 == 0)
          daysToAdd -= 2;
      }
    }
    let d = new Date()
    d.setDate(startDate.getDate() + daysToAdd);
    if (roundToDay != null) {
      while (d.getDay() != roundToDay) {
        d.setDate(d.getDate() + 1);
      }
    }
    return d;
  }

}
