import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md'
import * as firebase from 'firebase'
import { HttpClient } from '@angular/common/http';
import { PaypalService } from '../../../../../../services/paypal.service'

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit {
  @Input() order;
  @Input() uid;
  @ViewChild('areYouSure', { static: false }) areYouSure: ModalDirective
  orderTime;
  total;
  subtotal;
  shipMethod;
  shipPrice;
  userCart;
  numItems;
  orderOwner;
  promiseDate;
  daysLeft;
  moveTo;
  orderTimeMS;
  cat;
  completedAt;
  trackingNumber;
  noTrackErr = false;
  carrierName;
  carrierNameOther;
  transactionId;
  paypalAuthToken
  trackingInfo;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private paypalReq: PaypalService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.cat = params.get('cat');
      try {
        this.parseOrder(this.order)
      } catch (e) { }
    });
  }

  parseOrder(order) {
    let time = +(order[0].split("-")[1])
    this.transactionId = order[0].split("-")[0]
    this.orderTimeMS = time
    let date = new Date(time)
    this.orderTime = date.toString().split(" ")
    for (let i = 0; i < 4; i++) {
      this.orderTime.pop()
    }
    this.orderTime = this.orderTime.join(" ")
    let orderObj = Object.values(order[1])
    if (this.uid === "all") {
      this.orderOwner = orderObj.pop()
    }
    if (this.cat != "open_orders") {
      this.trackingInfo = orderObj.pop()
    }
    this.total = orderObj.pop()
    this.subtotal = orderObj.pop()
    this.shipMethod = orderObj.pop()
    this.getPromiseDate(time, this.shipMethod)
    switch (this.shipMethod) {
      case "1": {
        this.shipMethod = 'Pickup in Store'
        if (this.cat == "intermediate_orders") {
          this.moveTo = "Delivered"
        } else {
          this.moveTo = "Ready for Pickup"
        }
        break;
      }
      case "2": {
        this.shipMethod = 'Hand-Delivery Within the GTA'
        if (this.cat == "intermediate_orders") {
          this.moveTo = "Delivered"
        } else {
          this.moveTo = "Out for Delivery"
        }
        break;
      }
      case "3": {
        this.shipMethod = 'Standard Worldwide Shipping'
        if (this.cat == "intermediate_orders") {
          this.moveTo = "Delivered"
        } else {
          this.noTrackErr = true;
          this.moveTo = "Shipped"
        }
        break;
      }
      case "4": {
        this.shipMethod = 'Express Worldwide Shipping'
        if (this.cat == "intermediate_orders") {
          this.moveTo = "Delivered"
        } else {
          this.noTrackErr = true;
          this.moveTo = "Shipped"
        }
        break;
      }
    }
    this.numItems = orderObj.pop()
    if (this.cat === "complete_orders") {
      this.completedAt = orderObj.pop()
      let d = new Date(+(this.completedAt))
      this.completedAt = d.toDateString()

    }
    this.shipPrice = +(this.total) - +(this.subtotal)
    this.userCart = Object.values(orderObj)
  }

  getPromiseDate(time, ship) {
    let date = new Date(time)
    switch (ship) {
      case "1": {
        this.promiseDate = this.addWorkDays(date, 12, 6).toDateString()
        break;
      }
      case "2": {
        this.promiseDate = this.addWorkDays(date, 12, 5).toDateString()
        break;
      }
      case "3": {
        let d3Min = this.addWorkDays(date, 6, null)
        let d3Max = this.addWorkDays(date, 10, null)
        this.promiseDate = d3Min.toDateString() + ' - ' + d3Max.toDateString();
        break;
      }
      case "4": {
        let d4Min = this.addWorkDays(date, 4, null)
        let d4Max = this.addWorkDays(date, 6, null)
        this.promiseDate = d4Min.toDateString() + ' - ' + d4Max.toDateString();
        break;
      }
    }
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

  showAreYouSure(tracking) {
    if ((tracking && this.carrierName) || !this.noTrackErr) {
      this.trackingNumber = tracking;
      this.areYouSure.show();
    } else {
    }
  }

  moveToIntermediate() {
    let self = this
    this.areYouSure.hide()
    let user = this.uid;
    if (this.orderOwner) {
      user = this.orderOwner
    }
    firebase.database().ref('Admin/Open-orders/' + user + '/' + self.transactionId + '-' + self.orderTimeMS).once('value', function (orderData) {
      let updates = {}
      if (self.moveTo != "Delivered") {
        updates['Admin/Intermediate-orders/' + user + '/' + self.transactionId + '-' + self.orderTimeMS] = orderData.val()
        updates['Users/' + user + '/Intermediate-orders/' + self.transactionId + '-' + self.orderTimeMS] = orderData.val()
        firebase.database().ref().update(updates);

        if (self.trackingNumber) {
          let trackObj
          if (self.carrierNameOther) {
            trackObj = {
              tracking_number: self.trackingNumber,
              carrier: self.carrierName,
              carrier_name_other: self.carrierNameOther
            }
          } else {
            trackObj = {
              tracking_number: self.trackingNumber,
              carrier: self.carrierName,
              carrier_name_other: ""
            }
          }
          updates = {}
          updates['Admin/Intermediate-orders/' + user + '/' + self.transactionId + '-' + self.orderTimeMS + '/tracking'] = trackObj
          updates['Users/' + user + '/Intermediate-orders/' + self.transactionId + '-' + self.orderTimeMS + '/tracking'] = trackObj
          firebase.database().ref().update(updates);
          self.paypalReq.giveTracking(self.transactionId, self.trackingNumber, self.carrierName, self.carrierNameOther, "SHIPPED")
        }
      } else {
        let date = new Date()
        // self.paypalReq.giveTracking(self.transactionId, self.trackingInfo.tracking_number, self.trackingInfo.carrier, self.trackingInfo.carrier_name_other, "DELIVERED")

        if (!orderData.val()) {
          firebase.database().ref('Admin/Intermediate-orders/' + user + '/' + self.transactionId + '-' + self.orderTimeMS).once('value', function (interData) {
            let newData = interData.val()
            newData.completedAt = date.getTime()
            updates['Admin/Complete-orders/' + user + '/' + self.transactionId + '-' + self.orderTimeMS] = newData
            updates['Users/' + user + '/Complete-orders/' + self.transactionId + '-' + self.orderTimeMS] = newData
          })
          firebase.database().ref('Admin/Intermediate-orders/' + user + '/' + self.transactionId + '-' + self.orderTimeMS).remove()
          firebase.database().ref('Users/' + user + '/Intermediate-orders/' + self.transactionId + '-' + self.orderTimeMS).remove()
        } else {
          let newData = orderData.val()
          newData.completedAt = date.getTime()
          updates['Admin/Complete-orders/' + user + '/' + self.transactionId + '-' + self.orderTimeMS] = newData
          updates['Users/' + user + '/Complete-orders/' + self.transactionId + '-' + self.orderTimeMS] = newData
          firebase.database().ref().update(updates)
        }
      }
      return firebase.database().ref().update(updates);
    })
    firebase.database().ref('Admin/Open-orders/' + user + '/' + self.transactionId + '-' + self.orderTimeMS).remove()
    firebase.database().ref('Users/' + user + '/Open-orders/' + self.transactionId + '-' + self.orderTimeMS).remove()
    self.router.navigate(['/admin/' + self.cat], { relativeTo: this.route });
  }

  carrier(event) {
    this.carrierName = event
    if (this.carrierName === "OTHER") {
      this.carrierNameOther = "Latvijas Pasts"
    }
  }
}
