import { Component, OnInit } from '@angular/core';
import { MessengerService } from 'src/app/services/messenger.service'
import { Product } from 'src/app/models/product';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems = [
    // { id: 1, productId: 1, productName: 'Product 1', qty: 2, price: 39 },
    // { id: 2, productId: 3, productName: 'Product 3', qty: 1, price: 59 }
  ]

  cartTotal = 0

  constructor(private msg: MessengerService) { }

  ngOnInit() {
    this.msg.getMsg().subscribe((product: Product) => {
      this.addProductToCart(product)
    })
  }

  addProductToCart(product: Product) {
    const newItem = {
      productId: product.id,
      productName: product.name,
      qty: 1,
      price: product.price
    }

    let productExists = false

    for (let i = 0; i < this.cartItems.length; i += 1) {
      const item = this.cartItems[i]
      if (item.productId === product.id) {
        productExists = true
        item.qty += 1
        break;
      }
    }
    if (!productExists) {
      this.cartItems.push(newItem)
    }

    this.cartTotal = 0
    this.cartItems.forEach(item => {
      this.cartTotal += item.price * item.qty
    })
  }


}
