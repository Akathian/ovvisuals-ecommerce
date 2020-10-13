import { Component, OnInit, Input } from '@angular/core';
import { AdminCheckService } from '../../../../../services/admin-check.service';
@Component({
  selector: 'app-order-admin',
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.scss']
})
export class OrderAdminComponent implements OnInit {
  @Input() uid;
  @Input() cat;

  orders;
  customOrders;
  times = 0;
  // eslint-disable-next-line prettier/prettier
  constructor(private admin: AdminCheckService) { }

  ngOnInit() {
    this.times = 0;
  }

  getOrdersByUid(uid) {
    try {
      if (!this.times) {
        if (uid != 'all') {
          if (this.admin[this.cat].fullObj[uid]) {
            this.orders = Object.entries(this.admin[this.cat].fullObj[uid]);
          }
          if (this.admin[this.cat + '_custom'].fullObj[uid]) {
            this.customOrders = Object.entries(this.admin[this.cat + '_custom'].fullObj[uid]);
          }
        } else {
          if (this.admin[this.cat].allOrders) {
            this.orders = Object.entries(this.admin[this.cat].allOrders).sort(
              function(a, b) {
                const c = +(b[0]) - +(a[0]);
                return c;
              }
            );
          }
          if (this.admin[this.cat + '_custom'].allOrders) {
            this.customOrders = Object.entries(this.admin[this.cat + '_custom'].allOrders);
          }
        }
        this.times++;
      }
    } catch (e) { //
     }

  }

  sortAll(event) {
    let sortFn;
    const self = this;
    let aTime, aShip, aDay, bTime, bShip, bDay;
    switch (event) {
      case '1': {
        sortFn = (a, b) => {
          const c = +(b[0]) - +(a[0]);
          return c;
        };
        break;
      }
      case '2': {
        sortFn = (a, b) => {
          const c = +(a[0]) - +(b[0]);
          return c;
        };
        break;
      }
      case '3': {
        sortFn = (a, b) => {
          aTime = +(a[0]);
          bTime = +(b[0]);
          aShip = a[1].shipMethod;
          bShip = b[1].shipMethod;
          aDay = self.getPromiseDate(aTime, aShip);
          bDay = self.getPromiseDate(bTime, bShip);
          const c = aDay - bDay;
          return c;
        };
        break;
      }
      case '4': {
        sortFn = (a, b) => {
          aTime = +(a[0]);
          bTime = +(b[0]);
          aShip = a[1].shipMethod;
          bShip = b[1].shipMethod;
          aDay = self.getPromiseDate(aTime, aShip);
          bDay = self.getPromiseDate(bTime, bShip);
          const c = bDay - aDay;
          return c;
        };
        break;
      }
    }

    if (this.uid != 'all') {
      this.orders = Object.entries(this.admin[this.cat].fullObj[this.uid]).sort(sortFn);
    } else {
      this.orders = Object.entries(this.admin[this.cat].allOrders).sort(sortFn);
    }

  }

  getPromiseDate(time, ship) {
    const date = new Date(time);
    let promiseDate;
    switch (ship) {
      case '1': {
        promiseDate = this.addWorkDays(date, 12, 6).getTime();
        break;
      }
      case '2': {
        promiseDate = this.addWorkDays(date, 12, 5).getTime();
        break;
      }
      case '3': {
        promiseDate = this.addWorkDays(date, 10, null).getTime();

        break;
      }
      case '4': {
        promiseDate = this.addWorkDays(date, 6, null).getTime();
        break;
      }
    }
    return promiseDate;
  }

  addWorkDays(startDate, days, roundToDay) {
    if (isNaN(days)) {
      return;
    }
    if (!(startDate instanceof Date)) {
      return;
    }
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
    const dow = startDate.getDay();
    let daysToAdd = parseInt(days);
    // If the current day is Sunday add one day
    if (dow == 0) {
      daysToAdd++;
    }
    // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
    if (dow + daysToAdd >= 6) {
      // Subtract days in current working week from work days
      const remainingWorkDays = daysToAdd - (5 - dow);
      // Add current working week's weekend
      daysToAdd += 2;
      if (remainingWorkDays > 5) {
        // Add two days for each working week by calculating how many weeks are included
        daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
        // Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
        if (remainingWorkDays % 5 == 0) {
          daysToAdd -= 2;
        }
      }
    }
    const d = new Date();
    d.setDate(startDate.getDate() + daysToAdd);
    if (roundToDay != null) {
      while (d.getDay() != roundToDay) {
        d.setDate(d.getDate() + 1);
      }
    }
    return d;
  }

}
