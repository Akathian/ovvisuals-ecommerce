import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as firebase from 'firebase'
import { ActivatedRoute, Router } from '@angular/router';

declare const paypal;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  paidFor = false;
  userCart = [];
  numItems = 0;
  total = 0;
  totalWithSH = 0;
  purchase_units;
  shipSelect = false;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userCart = this.getCart();
      this.payPalCalc()
    });

  }
  payPalCalc() {
    let self = this
    paypal.Buttons({
      onInit: (data, actions) => {
        actions.disable();
        document.querySelector('#shippingSelect').addEventListener('change', function (event) {
          let e = +(<HTMLInputElement>event.target).value
          if ([1, 2, 3, 4].includes(e) && self.numItems > 0) {
            actions.enable();
          }
        })
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: self.purchase_units
        })
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          self.moveToOpenOrders();
          console.log('Transaction completed by ' + details.payer.name.given_name + '!');
        });
      }
    }).render(this.paypalElement.nativeElement)
  }

  moveToOpenOrders() {
    let date = new Date()
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('/Users/' + user.uid + '/Cart').once('value', function (cartData) {
          let updates = {}
          updates["Admin/Open-orders/" + user.uid + "/" + date.getTime()] = cartData.val()
          updates["Users/" + user.uid + "/Open-orders/" + date.getTime()] = cartData.val()
          return firebase.database().ref().update(updates);
        })
        firebase.database().ref('Users/' + user.uid + '/Cart/').remove()
        self.numItems = 0
        self.userCart = [{}]
        self.totalWithSH = 0;
        self.total = 0;
        self.router.navigate(['../login/open-orders'], { relativeTo: self.route });
      }
    })
  }

  toPaypalFormat(self, cart) {
    let total = Number.parseFloat(cart.pop()).toFixed(2)
    let subtotal = Number.parseFloat(cart.pop()).toFixed(2)
    let shipMethod = Number.parseFloat(cart.pop()).toFixed(2)
    let shipPrice = Number.parseFloat(`${+(total) - +(subtotal)}`).toFixed(2)
    switch (shipMethod) {
      case "1": {
        shipMethod = 'Pickup'
        break;
      }
      case "2": {
        shipMethod = 'Hand-Delivery Within the GTA'
        break;
      }
      case "3": {
        shipMethod = 'Standard Worldwide Shipping'
        break;
      }
      case "4": {
        shipMethod = 'Express Worldwide Shipping'
        break;
      }
    }
    let itemNum = cart.pop()
    let purchase_units = [{
      amount: {
        currency_code: 'CAD',
        value: total,
        breakdown: {
          item_total: {
            currency_code: 'CAD',
            value: subtotal
          },
          shipping: {
            currency_code: 'CAD',
            value: shipPrice
          }
        }
      },
      items: []
    }]
    for (let cartItem of cart) {
      let prod = self.getProdData(cartItem);
      let item = {
        name: `${prod.name} ${prod.size}`,
        quantity: `${prod.qty}`,
        unit_amount: {
          currency_code: 'CAD',
          value: `${prod.price}`
        }
      }
      purchase_units[0].items.push(item)
    }
    self.purchase_units = purchase_units
  }

  getProdData(cartItem) {
    let prod = cartItem.lg || cartItem.md || cartItem.rg || cartItem.sm || cartItem.xl
    return prod
  }

  getCart() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('/Users/' + user.uid + '/Cart').on('value', function (cartData) {
          self.userCart = Object.values(cartData.val())
          self.numItems = self.userCart[self.userCart.length - 4]
          self.total = self.userCart[self.userCart.length - 2]
          self.toPaypalFormat(self, self.userCart)
        })
      } else {
        self.userCart = []
      }
    });
    return this.userCart
  }

  addToWishList(item) {
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
        self.shipSelect = true
      }
    })
  }




}

