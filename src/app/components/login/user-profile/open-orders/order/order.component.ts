import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @Input() order;
  cat;
  orderTime;
  total;
  subtotal;
  shipMethod;
  shipPrice;
  userCart;
  numItems;
  transactionId;
  trackingInfo;
  statusText;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.cat = params.get('cat');
      this.parseOrder(this.order)
    });
  }

  parseOrder(order) {
    let time = +(order[0].split("-")[1])
    this.transactionId = order[0].split("-")[0]
    let date = new Date(time)
    this.orderTime = date.toString().split(" ")
    for (let i = 0; i < 4; i++) {
      this.orderTime.pop()
    }
    this.orderTime = this.orderTime.join(" ")
    let orderObj = Object.values(order[1])
    if (this.cat != "open-orders") {
      this.trackingInfo = orderObj.pop()
    }
    this.total = orderObj.pop()
    this.subtotal = orderObj.pop()
    this.shipMethod = orderObj.pop()
    switch (this.shipMethod) {
      case "1": {
        this.shipMethod = 'Pickup in Store'
        this.statusText = 'Ready for Pickup'
        break;
      }
      case "2": {
        this.shipMethod = 'Hand-Delivery Within the GTA'
        this.statusText = 'Out For Delivery'
        break;
      }
      case "3": {
        this.shipMethod = 'Standard Worldwide Shipping'
        this.statusText = 'Shipped'
        break;
      }
      case "4": {
        this.shipMethod = 'Express Worldwide Shipping'
        this.statusText = 'Shipped'
        break;
      }
    }
    this.numItems = orderObj.pop()
    this.shipPrice = +(this.total) - +(this.subtotal)
    this.userCart = Object.values(orderObj)
  }
}
