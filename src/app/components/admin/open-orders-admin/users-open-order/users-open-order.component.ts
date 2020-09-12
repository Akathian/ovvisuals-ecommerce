import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-open-order',
  templateUrl: './users-open-order.component.html',
  styleUrls: ['./users-open-order.component.scss']
})
export class UsersOpenOrderComponent implements OnInit {
  @Input() order;
  user;
  numOrders;
  cat;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.cat = params.get('cat');

    });
    this.parseOrder()
  }

  parseOrder() {
    this.user = this.order[0]
    this.numOrders = Object.keys(this.order[1]).length
  }
}
