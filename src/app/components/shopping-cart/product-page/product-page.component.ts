import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'
import { Product } from 'src/app/models/product'
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import { ModalDirective } from 'angular-bootstrap-md'

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements AfterViewInit {
  @ViewChild('loginModal', { static: false }) loginModal: ModalDirective
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective

  id: number;
  type: string;
  productList: Product[] = []
  product: Product;
  itemProd: {}[] = [{}];
  cartItem: {} = {};

  constructor(private productService: ProductService, private _Activatedroute: ActivatedRoute) { }

  ngAfterViewInit() {
    this._Activatedroute.paramMap.subscribe(async params => {
      this.id = +params.get('id');
      this.type = params.get('type');
      this.type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      this.itemProd = this.productService.getItemFromDB(this.type);
      this.doModal();
    });
  }

  addToCart() {
    let size = (<HTMLInputElement>document.getElementById('sizeSelect')).value;
    if (size) {
      let prods = this.productService.tmpItem[0]
      let keys = Object.keys(prods)
      let sku, prodSize;
      let itemData;
      for (let key in keys) {
        let prod = prods[key]
        if (prod.sku == this.id) {
          itemData = {
            sku: prod.sku,
            price: prod.price[size],
            size: prod.size[size],
            sizeCode: size,
            name: prod.name,
            img: prod.img.cover,
            qty: 1,
            type: this.type,
          }
          itemData.type = itemData.type.charAt(0).toLowerCase() + itemData.type.slice(1);
          sku = prod.sku
          prodSize = prod.size[size]
          this.cartItem = itemData;
        }
      }
      let self = this
      firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
          self.doModal()
        } else {
          document.getElementById('no-size-err').style.display = 'none'
          firebase.database().ref('Users/' + user.uid + '/Cart/' + sku + '/' + size).once('value', function (sizeData) {
            if (!sizeData.val()) {
              let updates = {};
              updates['/Users/' + user.uid + '/Cart/' + sku + '/' + size] = itemData;
              return firebase.database().ref().update(updates);
            } else {
              let updates = {};
              let dta = itemData
              updates['/Users/' + user.uid + '/Cart/' + sku + '/' + size] = dta;
              firebase.database().ref().update(updates);
              updates = {};
              updates['/Users/' + user.uid + '/Cart/' + sku + '/' + size + '/' + 'qty'] = sizeData.val().qty + 1;
              firebase.database().ref().update(updates);
            }
          })
          firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').once('value', function (itemQtyData) {
            let currQty = itemQtyData.val() || 0
            let updates = {};
            updates['/Users/' + user.uid + '/Cart/' + 'itemQty'] = itemData.qty + currQty;
            return firebase.database().ref().update(updates);
          })
          firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').once('value', function (totalData) {
            let currTotal = totalData.val() || 0
            let updates = {};
            updates['/Users/' + user.uid + '/Cart/' + 'total'] = itemData.price * itemData.qty + currTotal;
            return firebase.database().ref().update(updates);
          })
          self.confirmModal.show();
        }
      })
    }
    else {
      document.getElementById('no-size-err').style.display = '';
    }
  }


  doModal() {
    try {
      this.loginModal.show()
    } catch (e) {
      this.loginModal.show()
    }
    let typeLow = this.type.charAt(0).toLowerCase() + this.type.slice(1);
    var uiConfig = {
      signInSuccessUrl: `/products/${typeLow}/${this.id}`,
      'signInFlow': 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      tosUrl: '<your-tos-url>',
      privacyPolicyUrl: function () {
        window.location.assign('<your-privacy-policy-url>');
      }
    };
    try {
      var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', uiConfig);
    } catch (e) {
    }
  }

}
