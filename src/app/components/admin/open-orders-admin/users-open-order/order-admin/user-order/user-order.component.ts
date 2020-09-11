import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit {
  @Input() order;
  @Input() uid;
  orderTime;
  total;
  subtotal;
  shipMethod;
  shipPrice;
  userCart;
  numItems;
  orderOwner;
  constructor() { }

  ngOnInit() {
    this.parseOrder(this.order)
  }

  parseOrder(order) {
    let time = +(order[0])
    let date = new Date(time)
    this.orderTime = date.toString().split(" ")
    for (let i = 0; i < 4; i++) {
      this.orderTime.pop()
    }
    this.orderTime = this.orderTime.join(" ")
    console.log(this.orderTime)
    let orderObj = Object.values(order[1])
    if (this.uid === "all") {
      this.orderOwner = orderObj.pop()

    }
    this.total = orderObj.pop()
    this.subtotal = orderObj.pop()
    this.shipMethod = orderObj.pop()
    switch (this.shipMethod) {
      case "1": {
        this.shipMethod = 'Pickup in Store'
        break;
      }
      case "2": {
        this.shipMethod = 'Hand-Delivery Within the GTA'
        break;
      }
      case "3": {
        this.shipMethod = 'Standard Worldwide Shipping'
        break;
      }
      case "4": {
        this.shipMethod = 'Express Worldwide Shipping'
        break;
      }
    }
    this.numItems = orderObj.pop()
    this.shipPrice = +(this.total) - +(this.subtotal)
    this.userCart = Object.values(orderObj)
  }

}
