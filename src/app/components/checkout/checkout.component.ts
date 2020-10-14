import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
// eslint-disable-next-line prettier/prettier
declare const paypal;
import { ModalDirective } from 'angular-bootstrap-md';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;

  paidFor = false;
  userCart = [];
  numItems = 0;
  total = 0;
  totalWithSH;
  paypalObj;
  shipSelect = false;
  disableAll = false;
  supportedCities = ['markham', 'scarborough'];
  shipCode;
  constructor(private route: ActivatedRoute, private router: Router, private titleService: Title) {
    this.titleService.setTitle('Checkout | OVVisuals');
  }

  ngOnInit() {
    this.userCart = this.getCart();
    this.payPalCalc();
  }

  payPalCalc() {
    const self = this;
    paypal.Buttons({
      onInit: (data, actions) => {
        actions.disable();
        document.querySelector('#shippingSelect').addEventListener('change', function(event) {
          const e = +(event.target as HTMLInputElement).value;
          if ([1, 2, 3, 4].includes(e) && self.numItems > 0) {
            actions.enable();
          }
        });
      },
      createOrder: (data, actions) => {
        self.disableAll = true;
        return actions.order.create(self.paypalObj);
      },
      onShippingChange: (data, actions) => {
        if (self.supportedCities.indexOf(data.shipping_address.city.toLowerCase()) != 0 && self.shipCode == '2') {
          actions.reject();
        }
      },
      onApprove(data, actions) {
        return actions.order.capture().then(function(details) {
          self.moveToOpenOrders(details.purchase_units[0].payments.captures[0].id);
          self.disableAll = false;
        },
        );
      },
      onError(err) {
        //
      },
      onCancel(data, actions) {
        self.disableAll = false;
      }
    }).render(this.paypalElement.nativeElement);
  }

  moveToOpenOrders(transactionId) {
    const date = new Date();
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('/Users/' + user.uid + '/Cart').once('value', function(cartData) {
          const updates = {};
          const time = date.getTime();
          updates['Admin/Open-orders/' + user.uid + '/' + `${transactionId}-${time}`] = cartData.val();
          updates['Users/' + user.uid + '/Open-orders/' + `${transactionId}-${time}`] = cartData.val();
          self.moveToAccounting(user, time, cartData.val());
          return firebase.database().ref().update(updates);
        });
        firebase.database().ref('Users/' + user.uid + '/Cart/').remove();
        self.numItems = 0;
        self.userCart = [{}];
        self.totalWithSH = 0;
        self.total = 0;
        self.router.navigate(['../login/open-orders'], { relativeTo: self.route });
      }
    });
  }

  moveToAccounting(user, time, cart) {
    const a = Object.entries(cart);
    const totalWithSH = a.pop()[1];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const total = a.pop();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ship = a.pop();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemQty = a.pop();
    let names = '';
    for (const item of a) {
      const b = Object.entries(item);
      const c = b.pop();
      const d = c.pop();
      const e = Object.entries(d);
      for (const ind of e) {
        const name = ind[1].name + ' ' + ind[1].size;
        names += name + ', ';
      }
    }
    const updates = {};
    const acc = {
      name: user.displayName,
      order: names,
      total: totalWithSH
    };
    updates['Admin/Accounting/' + user.uid + `/${time}`] = acc;
    firebase.database().ref().update(updates);
  }

  toPaypalFormat(self, cart) {
    const total = Number.parseFloat(cart.pop()).toFixed(2);
    const subtotal = Number.parseFloat(cart.pop()).toFixed(2);
    let shipMethod = Number.parseFloat(cart.pop()).toFixed(2);
    const shipPrice = Number.parseFloat(`${+(total) - +(subtotal)}`).toFixed(2);
    let shipCode;
    switch (shipMethod) {
      case '1': {
        shipMethod = 'Pickup';
        shipCode = 'PICKUP';
        break;
      }
      case '2': {
        shipMethod = 'Hand-Delivery Within the GTA';
        shipCode = 'SHIPPING';
        break;
      }
      case '3': {
        shipMethod = 'Standard Worldwide Shipping';
        shipCode = 'SHIPPING';
        break;
      }
      case '4': {
        shipMethod = 'Express Worldwide Shipping';
        shipCode = 'SHIPPING';
        break;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemNum = cart.pop();
    const paypalObj = {
      purchase_units: [{
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
      }],
      shipping_type: shipCode
    };
    for (const cartItem of cart) {
      const prod = self.getProdData(cartItem);
      const item = {
        name: `${prod.name} ${prod.size}`,
        quantity: `${prod.qty}`,
        unit_amount: {
          currency_code: 'CAD',
          value: `${prod.price}`
        },
        category: 'PHYSICAL_GOODS'
      };
      paypalObj.purchase_units[0].items.push(item);
    }
    self.paypalObj = paypalObj;
  }

  getProdData(cartItem) {
    const prod = cartItem.lg || cartItem.md || cartItem.rg || cartItem.sm || cartItem.xl;
    return prod;
  }

  getCart() {
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('/Users/' + user.uid + '/Cart').on('value', function(cartData) {
          self.userCart = Object.values(cartData.val());
          self.numItems = self.userCart[self.userCart.length - 4];
          self.total = self.userCart[self.userCart.length - 2];
          self.toPaypalFormat(self, self.userCart);
        });
      } else {
        self.userCart = [];
      }
    });
    return this.userCart;
  }

  addToWishList(item) {
    if (!this.disableAll) {
      item.qty = 1;
      const self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('Users/' + user.uid + '/Wishlist/' + item.sku + '/' + item.sizeCode).once('value', function(wListData) {
            if (!wListData.val()) {
              firebase.database().ref('Users/' + user.uid + '/Wishlist/' + 'itemQty').once('value', function(itemQtyData) {
                const currQty = itemQtyData.val() || 0;
                const updates = {};
                updates['/Users/' + user.uid + '/Wishlist/' + 'itemQty'] = item.qty + currQty;
                return firebase.database().ref().update(updates);
              });
              const updates = {};
              updates['Users/' + user.uid + '/Wishlist/' + item.sku + '/' + item.sizeCode] = item;
              return firebase.database().ref().update(updates);
            }
          });
          self.removeItem(item);
        }
      });
    }
  }

  removeItem(item) {
    if (!this.disableAll) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let rmQty;
          let rmTotal;
          firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku).once('value', function(skuData) {
            if (skuData.val()[item.sizeCode]) {
              rmQty = skuData.val()[item.sizeCode].qty;
              rmTotal = skuData.val()[item.sizeCode].price * rmQty;
              firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode).remove();
              firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').once('value', function(itemQtyData) {
                let currQty = itemQtyData.val() || 0;
                const updates = {};
                if (currQty - rmQty < 0) {
                  currQty = 0;
                  rmQty = 0;
                }
                updates['/Users/' + user.uid + '/Cart/' + 'itemQty'] = currQty - rmQty;
                return firebase.database().ref().update(updates);
              });
              firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').once('value', function(totalData) {
                let currTotal = totalData.val() || 0;
                const updates = {};
                if (currTotal - rmTotal < 0) {
                  currTotal = 0;
                  rmTotal = 0;
                }
                updates['/Users/' + user.uid + '/Cart/' + 'total'] = +(currTotal - rmTotal).toFixed(2);
                return firebase.database().ref().update(updates);
              });
            }
          });
        }
      });
    }
  }

  qtyChange(item, incr: number) {
    if (!this.disableAll) {
      const self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode).once('value', function(skuData) {
            if (skuData.val()) {

              firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode + '/qty').once('value', function(qtyData) {
                const currQty = qtyData.val() || 0;
                const newVal = (currQty + incr > 0) ? (currQty + incr) : 0;
                if (newVal > 0) {
                  const updates = {};
                  updates['/Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode + '/qty'] = newVal;
                  firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').once('value', function(itemQtyData) {
                    const currQty = itemQtyData.val() || 0;
                    const newVal = (currQty + incr > 0) ? (currQty + incr) : 0;
                    if (newVal > 0) {
                      const updates = {};
                      updates['/Users/' + user.uid + '/Cart/' + 'itemQty'] = newVal;
                      return firebase.database().ref().update(updates);
                    }
                  });
                  firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').once('value', function(totalData) {
                    const currTotal = totalData.val() || 0;
                    const newVal = (currTotal + incr * (item.price) > 1) ? (currTotal + incr * (item.price)) : 0;
                    const updates = {};
                    updates['/Users/' + user.uid + '/Cart/' + 'total'] = newVal;
                    return firebase.database().ref().update(updates);
                  });
                  return firebase.database().ref().update(updates);
                } else {
                  self.removeItem(item);
                }
              });


            }

          });
        }
      });
    }
  }

  shippingMethod(type) {
    if (!this.disableAll) {
      this.shipCode = type;
      const self = this;
      if (type == '2') {
        this.confirmModal.show();
      }
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let updates = {};
          let shipPrice = 0;
          let add;
          updates['Users/' + user.uid + '/Cart/' + 'shipMethod'] = type;
          firebase.database().ref().update(updates);
          firebase.database().ref('Shipping/' + (+(type) - 1)).once('value', function(shipData) {
            add = shipData.val().add;
            shipPrice = shipData.val().price;
            updates = {};
            firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').on('value', function(totalData) {
              firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').on('value', function(qtyData) {
                const total = totalData.val();
                const numItems = qtyData.val();
                if (add) {
                  updates['Users/' + user.uid + '/Cart/' + 'totalWithSH'] = total + shipPrice;
                  self.totalWithSH = total + shipPrice;
                  return firebase.database().ref().update(updates);
                } else {
                  updates['Users/' + user.uid + '/Cart/' + 'totalWithSH'] = total - (shipPrice * numItems);
                  self.totalWithSH = total - (shipPrice * numItems);
                  return firebase.database().ref().update(updates);
                }
              });
            });

          });
          self.shipSelect = true;
        }
      });
    }
  }
}

