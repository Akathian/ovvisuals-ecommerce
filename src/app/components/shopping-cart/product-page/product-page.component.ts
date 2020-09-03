import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'
import { Product } from 'src/app/models/product'
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import * as firebase from 'firebase'


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  id: number;
  type: string;
  productList: Product[] = []
  product: Product;
  itemProd: {}[] = [{}];
  currUser: {};

  constructor(private productService: ProductService, private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(async params => {
      this.id = +params.get('id');
      this.type = params.get('type');
      this.type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      this.itemProd = this.productService.getItemFromDB(this.type);
    });
  }

  qty() {
    $('.btn-number').click(function (e) {
      e.preventDefault();

      let fieldName = $(this).attr('data-field');
      let type = $(this).attr('data-type');
      var input = $("input[name='" + fieldName + "']");
      var currentVal = parseInt(input.val());
      if (!isNaN(currentVal)) {
        if (type == 'minus') {

          if (currentVal > input.attr('min')) {
            input.val(currentVal - 1).change();
          }
          if (parseInt(input.val()) == input.attr('min')) {
            $(this).attr('disabled', true);
          }

        } else if (type == 'plus') {

          if (currentVal < input.attr('max')) {
            input.val(currentVal + 1).change();
          }
          if (parseInt(input.val()) == input.attr('max')) {
            $(this).attr('disabled', true);
          }

        }
      } else {
        input.val(0);
      }
    });
    $('.input-number').focusin(function () {
      $(this).data('oldValue', $(this).val());
    });
    $('.input-number').change(function () {

      let minValue = parseInt($(this).attr('min'));
      let maxValue = parseInt($(this).attr('max'));
      let valueCurrent = parseInt($(this).val());

      let name = $(this).attr('name');
      if (valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
      } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
      }
      if (valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
      } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
      }


    });
    $(".input-number").keydown(function (e) {
      // Allow: backspace, delete, tab, escape, enter and .
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
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
            name: prod.name,
            img: prod.img.cover,
            qty: 1
          }
          sku = prod.sku
          prodSize = prod.size[size]
        }
      }
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          firebase.database().ref('Users/' + user.uid + '/Cart/' + sku + '/' + size).once('value', function (sizeData) {
            if (!sizeData.val()) {
              let updates = {};
              updates['/Users/' + user.uid + '/Cart/' + sku + '/' + size] = itemData;
              return firebase.database().ref().update(updates);
            } else {
              let updates = {};
              let newQty = sizeData.val().qty
              itemData.qty = newQty + 1
              updates['/Users/' + user.uid + '/Cart/' + sku + '/' + size] = itemData;
              return firebase.database().ref().update(updates);
            }
          })
          console.log("added to cart!")
        } else {
          firebase.auth().signInAnonymously
        }
      })
    }
    else {
      console.log('select a size!')
    }
  }

}
