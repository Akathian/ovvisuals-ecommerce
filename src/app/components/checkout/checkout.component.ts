import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import * as firebase from 'firebase'
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service'
import { isEmptyExpression } from '@angular/compiler';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewChecked {
  d: Date = new Date(); // but the type can also be inferred from "new Date()" already
  userCart = [];
  numItems = 0;
  total = 0;
  totalWithSH = 0;
  constructor(private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.userCart = this.getCart();
    });

  }

  ngAfterViewChecked() {
    this.calculateShip()
  }

  getCart() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('/Users/' + user.uid + '/Cart').on('value', function (cartData) {
          self.userCart = Object.values(cartData.val())
          self.numItems = self.userCart[self.userCart.length - 4]
          self.total = self.userCart[self.userCart.length - 2]
        })
      } else {
        self.userCart = []
      }
    });
    return this.userCart
  }

  addToWishList(item) {
    console.log(item)
    item.qty = 1;
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('Users/' + user.uid + '/Wishlist/' + item.sku + '/' + item.sizeCode).once('value', function (wListData) {
          if (!wListData.val()) {
            firebase.database().ref('Users/' + user.uid + '/Wishlist/' + 'itemQty').once('value', function (itemQtyData) {
              let currQty = itemQtyData.val() || 0
              let updates = {};
              updates['/Users/' + user.uid + '/Wishlist/' + 'itemQty'] = item.qty + currQty;
              return firebase.database().ref().update(updates);
            })
            let updates = {}
            updates['Users/' + user.uid + '/Wishlist/' + item.sku + '/' + item.sizeCode] = item
            return firebase.database().ref().update(updates);
          }
        })


        self.removeItem(item);
      }
    })
  }

  removeItem(item) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let rmQty;
        let rmTotal;
        firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku).once('value', function (skuData) {
          if (skuData.val()[item.sizeCode]) {
            rmQty = skuData.val()[item.sizeCode].qty
            rmTotal = skuData.val()[item.sizeCode].price * rmQty
            firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku + "/" + item.sizeCode).remove()
            firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').once('value', function (itemQtyData) {
              let currQty = itemQtyData.val() || 0
              let updates = {};
              updates['/Users/' + user.uid + '/Cart/' + 'itemQty'] = currQty - rmQty;
              return firebase.database().ref().update(updates);
            })
            firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').once('value', function (totalData) {
              let currTotal = totalData.val() || 0
              let updates = {};
              updates['/Users/' + user.uid + '/Cart/' + 'total'] = +(currTotal - rmTotal).toFixed(2)
              return firebase.database().ref().update(updates);
            })
          }

        })
      }
    })
  }

  qtyChange(item, incr: number) {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode).once('value', function (skuData) {
          if (skuData.val()) {

            firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku + "/" + item.sizeCode + '/qty').once('value', function (qtyData) {
              let currQty = qtyData.val() || 0
              let newVal = (currQty + incr > 0) ? (currQty + incr) : 0;
              if (newVal > 0) {
                let updates = {};
                updates['/Users/' + user.uid + '/Cart/' + item.sku + "/" + item.sizeCode + '/qty'] = newVal
                firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').once('value', function (itemQtyData) {
                  let currQty = itemQtyData.val() || 0
                  let newVal = (currQty + incr > 0) ? (currQty + incr) : 0;
                  if (newVal > 0) {
                    let updates = {};
                    updates['/Users/' + user.uid + '/Cart/' + 'itemQty'] = newVal;
                    return firebase.database().ref().update(updates);
                  }
                })
                firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').once('value', function (totalData) {
                  let currTotal = totalData.val() || 0
                  let newVal = (currTotal + incr * (item.price) > 1) ? (currTotal + incr * (item.price)) : 0;
                  let updates = {};
                  updates['/Users/' + user.uid + '/Cart/' + 'total'] = newVal
                  return firebase.database().ref().update(updates);
                })
                return firebase.database().ref().update(updates);
              } else {
                self.removeItem(item)
              }
            })


          }

        })
      }
    })
  }

  shippingMethod(type) {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let updates = {}
        let shipPrice = 0;
        let add;
        updates['Users/' + user.uid + '/Cart/' + "shipMethod"] = type
        firebase.database().ref().update(updates);
        firebase.database().ref('Shipping/' + type).once('value', function (shipData) {
          add = shipData.val().add
          shipPrice = shipData.val().price
          updates = {}
          firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').on('value', function (totalData) {
            firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').on('value', function (qtyData) {
              let total = totalData.val()
              let numItems = qtyData.val()
              if (add) {
                updates['Users/' + user.uid + '/Cart/' + "totalWithSH"] = total + shipPrice;
                self.totalWithSH = total + shipPrice;
                return firebase.database().ref().update(updates);
              } else {
                updates['Users/' + user.uid + '/Cart/' + "totalWithSH"] = total - (shipPrice * numItems);
                self.totalWithSH = total - (shipPrice * numItems);
                return firebase.database().ref().update(updates);
              }
            })
          })

        })
      }
    })
  }

  calculateShip() {
    let d1 = this.addWorkDays(this.d, 12, 5)
    let d2 = new Date()
    d2.setDate(this.addWorkDays(this.d, 12, 5).getDate() + 1)
    document.getElementById('pickup').innerText = d2.toDateString() + " before 9:00p.m.";
    document.getElementById('hand-delivery').innerText = d1.toDateString() + " before 9:00p.m.";

    let d3Min = this.addWorkDays(this.d, 6, null)
    let d3Max = this.addWorkDays(this.d, 10, null)
    document.getElementById('standard').innerText = d3Min.toDateString() + ' - ' + d3Max.toDateString();

    let d4Min = this.addWorkDays(this.d, 4, null)
    let d4Max = this.addWorkDays(this.d, 6, null)
    document.getElementById('express').innerText = d4Min.toDateString() + ' - ' + d4Max.toDateString();
  }

  addWorkDays(startDate, days, roundToDay) {
    if (isNaN(days)) {
      console.log("Value provided for \"days\" was not a number");
      return
    }
    if (!(startDate instanceof Date)) {
      console.log("Value provided for \"startDate\" was not a Date object");
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

