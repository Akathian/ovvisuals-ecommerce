import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-users-open-order',
  templateUrl: './users-open-order.component.html',
  styleUrls: ['./users-open-order.component.scss']
})
export class UsersOpenOrderComponent implements OnInit {
  @Input() order;
  user;
  numOrders;

  constructor() { }

  ngOnInit() {
    this.parseOrder()
  }

  parseOrder() {
    this.user = this.order[0]
    this.numOrders = Object.keys(this.order[1]).length
  }
}
