/* eslint-disable @typescript-eslint/ban-types */
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { ModalDirective } from 'angular-bootstrap-md';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  animations: [
    trigger('explainerAnim', [
      transition('* => *', [
        query('.anim', style({ opacity: 0, transform: 'translateX(-40px)' })),
        query('.anim', stagger('500ms', [
          animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ]))
      ])
    ])
  ]
})
export class ProductPageComponent implements AfterViewInit, OnInit {
  @ViewChild('loginModal', { static: false }) loginModal: ModalDirective;
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;
  href;
  id: number;
  type: string;
  productList: Product[] = [];
  product: Product;
  itemProd: {}[] = [{}];
  cartItem: {} = {};
  imgs;
  // eslint-disable-next-line prettier/prettier
  constructor(private productService: ProductService, private _Activatedroute: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    this._Activatedroute.paramMap.subscribe(async params => {
      this.id = +params.get('id');
      this.type = params.get('type');
      this.href = '/products/' + this.type;
      this.type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      this.itemProd = this.productService.getItemFromDB(this.type);
      this.getImgs();
      this.doModal();
    });
  }
  getImgs() {
    const self = this;
    console.log(this.id);
    firebase.database().ref('Products/' + this.type + '/' + (+(this.id) - 1)).on('value', function(prod) {
      self.imgs = Object.values(prod.val().img);
      const a = self.imgs.pop();
      self.imgs = [a].concat(self.imgs);
      self.titleService.setTitle(prod.val().name + ' | OVVisuals');
    });
  }
  qtyChange(amt: number) {
    const curr = +(document.getElementById('qtyNum').innerText);
    if (amt < 0 && curr <= 1) {
      return;
    }
    document.getElementById('qtyNum').innerText = `${curr + amt}`;
  }


  addToCart() {
    const size = (document.getElementById('sizeSelect') as HTMLInputElement).value;
    const qty = +(document.getElementById('qtyNum').innerText);
    if (size) {
      const prods = this.productService.tmpItem[0];
      const keys = Object.keys(prods);
      let sku;
      let itemData;
      for (const key in keys) {
        const prod = prods[key];
        if (prod.sku == this.id) {
          itemData = {
            sku: prod.sku,
            price: prod.price[size],
            size: prod.size[size],
            sizeCode: size,
            name: prod.name,
            img: prod.img.cover,
            qty,
            type: this.type,
          };
          itemData.type = itemData.type.charAt(0).toLowerCase() + itemData.type.slice(1);
          sku = prod.sku;
          // prodSize = prod.size[size];
          this.cartItem = itemData;
        }
      }
      const self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
          self.doModal();
        } else {
          document.getElementById('no-size-err').style.display = 'none';
          firebase.database().ref('Users/' + user.uid + '/Cart/' + sku + '/' + size).once('value', function(sizeData) {
            if (!sizeData.val()) {
              const updates = {};
              updates['/Users/' + user.uid + '/Cart/' + sku + '/' + size] = itemData;
              return firebase.database().ref().update(updates);
            } else {
              let updates = {};
              const dta = itemData;
              updates['/Users/' + user.uid + '/Cart/' + sku + '/' + size] = dta;
              firebase.database().ref().update(updates);
              updates = {};
              updates['/Users/' + user.uid + '/Cart/' + sku + '/' + size + '/' + 'qty'] = sizeData.val().qty + itemData.qty;
              firebase.database().ref().update(updates);
            }
          });
          firebase.database().ref('Users/' + user.uid + '/Cart/' + 'itemQty').once('value', function(itemQtyData) {
            const currQty = itemQtyData.val() || 0;
            const updates = {};
            updates['/Users/' + user.uid + '/Cart/' + 'itemQty'] = itemData.qty + currQty;
            return firebase.database().ref().update(updates);
          });
          firebase.database().ref('Users/' + user.uid + '/Cart/' + 'total').once('value', function(totalData) {
            const currTotal = totalData.val() || 0;
            const updates = {};
            updates['/Users/' + user.uid + '/Cart/' + 'total'] = itemData.price * itemData.qty + currTotal;
            return firebase.database().ref().update(updates);
          });
          const updates = {};
          updates['Users/' + user.uid + '/Cart/' + 'totalWithSH'] = 0;
          updates['Users/' + user.uid + '/Cart/' + 'shipMethod'] = 0;
          firebase.database().ref().update(updates);
          self.confirmModal.show();
          document.getElementById('qtyNum').innerText = '1';
        }
      });
    } else {
      document.getElementById('no-size-err').style.display = '';
    }
  }

  addToWishList() {
    const size = (document.getElementById('sizeSelect') as HTMLInputElement).value;
    if (size) {
      const prods = this.productService.tmpItem[0];
      const keys = Object.keys(prods);
      let sku;
      let itemData;
      for (const key in keys) {
        const prod = prods[key];
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
          };
          itemData.type = itemData.type.charAt(0).toLowerCase() + itemData.type.slice(1);
          sku = prod.sku;
          // prodSize = prod.size[size];
          this.cartItem = itemData;
        }
      }
      const self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
          self.doModal();
        } else {
          document.getElementById('no-size-err').style.display = 'none';
          firebase.database().ref('Users/' + user.uid + '/Wishlist/' + sku + '/' + size).once('value', function(sizeData) {
            if (!sizeData.val()) {
              const updates = {};
              updates['/Users/' + user.uid + '/Wishlist/' + sku + '/' + size] = itemData;
              firebase.database().ref().update(updates);
              firebase.database().ref('Users/' + user.uid + '/Wishlist/' + 'itemQty').once('value', function(itemQtyData) {
                const currQty = itemQtyData.val() || 0;
                const updates = {};
                updates['/Users/' + user.uid + '/Wishlist/' + 'itemQty'] = itemData.qty + currQty;
                document.getElementById('wishButton').innerHTML = `<i id='wishHeart' class="fa fa-heart"></i> In your wishlist`;
                return firebase.database().ref().update(updates);
              });
            } else {
              firebase.database().ref('Users/' + user.uid + '/Wishlist/' + sku + '/' + size).remove();
              firebase.database().ref('Users/' + user.uid + '/Wishlist/' + 'itemQty').once('value', function(itemQtyData) {
                const currQty = itemQtyData.val() || 0;
                const updates = {};
                let newQty = currQty - 1;
                if (newQty < 0) {
                  newQty = 0;
                }
                updates['/Users/' + user.uid + '/Wishlist/' + 'itemQty'] = newQty;
                document.getElementById('wishButton').innerHTML = `<i id='wishHeart' class="fa fa-heart-o"></i> Add to wishlist`;
                return firebase.database().ref().update(updates);
              });
            }
          });
        }
      });
    } else {
      document.getElementById('no-size-err').style.display = '';
    }
  }

  sizeSelect(size) {
    this.changeWishListButton(size);
  }

  changeWishListButton(size) {
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('Users/' + user.uid + '/Wishlist/' + self.id + '/' + size).on('value', function(wData) {
          if (wData.val()) {
            document.getElementById('wishButton').innerHTML = `<i id='wishHeart' class="fa fa-heart"></i> In your wishlist`;
          } else {
            document.getElementById('wishButton').innerHTML = `<i id='wishHeart' class="fa fa-heart-o"></i> Add to wishlist`;
          }
        });
      }
    });
  }

  doModal() {
    try {
      this.loginModal.show();
    } catch (e) {
      this.loginModal.show();
    }
    const typeLow = this.type.charAt(0).toLowerCase() + this.type.slice(1);
    const uiConfig = {
      signInSuccessUrl: `/products/${typeLow}/${this.id}`,
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,

      ],
      tosUrl: '/terms',
      privacyPolicyUrl() {
        window.location.assign('/privacy');
      }
    };
    try {
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', uiConfig);
    } catch (e) {
    }
  }

  changeCover(src) {
    (document.getElementById('coverPic') as HTMLImageElement).src = src;
  }

}
