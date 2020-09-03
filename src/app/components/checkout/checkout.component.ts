import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service'
import { isEmptyExpression } from '@angular/compiler';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  userCart: {}[] = [{}]
  constructor(private productService: ProductService, private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.userCart = this.productService.getCart();
      console.log(this.userCart)
    });
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
              updates['/Users/' + user.uid + '/Cart/' + 'total'] = currTotal - rmTotal;
              return firebase.database().ref().update(updates);
            })
          }

        })


      }
    })
    console.log(item)
  }

}
