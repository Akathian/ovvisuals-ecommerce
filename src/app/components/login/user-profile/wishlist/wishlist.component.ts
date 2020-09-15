import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  @Input() user;
  @Input() limit;

  userWList = []

  constructor() { }

  ngOnInit() {
    this.userWList = this.getWList()
  }

  getWList() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('/Users/' + user.uid + '/Wishlist').on('value', function (wListData) {
          self.userWList = Object.values(wListData.val())
        })
      } else {
        self.userWList = []
      }
    });
    return this.userWList
  }

  addToCart(item) {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode).once('value', function (sizeData) {
          if (!sizeData.val()) {
            let updates = {};
            updates['/Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode] = item;
            return firebase.database().ref().update(updates);
          } else {
            let updates = {};
            let dta = item
            updates['/Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode] = dta;
            firebase.database().ref().update(updates);
            updates = {};
            updates['/Users/' + user.uid + '/Cart/' + item.sku + '/' + item.sizeCode + '/' + 'qty'] = sizeData.val().qty + 1;
            firebase.database().ref().update(updates);
          }
        })
        firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').once('value', function (itemQtyData) {
          let currQty = itemQtyData.val() || 0
          let updates = {};
          updates['/Users/' + user.uid + '/Cart/' + 'itemQty'] = item.qty + currQty;
          return firebase.database().ref().update(updates);
        })
        firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').once('value', function (totalData) {
          let currTotal = totalData.val() || 0
          let updates = {};
          updates['/Users/' + user.uid + '/Cart/' + 'total'] = item.price * item.qty + currTotal;
          return firebase.database().ref().update(updates);
        })
        let updates = {}
        updates['Users/' + user.uid + '/Cart/' + "totalWithSH"] = 0
        firebase.database().ref().update(updates);
        self.removeItem(item)
      }
    })
  }

  removeItem(item) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let rmQty;
        firebase.database().ref('Users/' + user.uid + '/Wishlist/' + item.sku).once('value', function (skuData) {
          if (skuData.val()[item.sizeCode]) {
            rmQty = skuData.val()[item.sizeCode].qty
            firebase.database().ref('Users/' + user.uid + '/Wishlist/' + item.sku + "/" + item.sizeCode).remove()
            firebase.database().ref('Users/' + user.uid + '/Wishlist/' + 'itemQty').once('value', function (itemQtyData) {
              let currQty = itemQtyData.val() || 0
              let updates = {};
              updates['/Users/' + user.uid + '/Wishlist/' + 'itemQty'] = currQty - rmQty;
              return firebase.database().ref().update(updates);
            })
          }

        })
      }
    })
  }
}
