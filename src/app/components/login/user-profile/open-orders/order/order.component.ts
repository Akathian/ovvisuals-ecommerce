import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @Input() order;
  orderTime;
  total;
  subtotal;
  shipMethod;
  shipPrice;
  userCart;

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
    this.total = orderObj.pop()
    this.subtotal = orderObj.pop()
    this.shipMethod = orderObj.pop()
    this.shipPrice = orderObj.pop()
    this.userCart = Object.values(orderObj)
  }

}
