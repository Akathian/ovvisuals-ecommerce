import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminCheckService } from '../../../../services/admin-check.service';
import * as firebase from 'firebase';
@Component({
  selector: 'app-users-open-order',
  templateUrl: './users-open-order.component.html',
  styleUrls: ['./users-open-order.component.scss']
})
export class UsersOpenOrderComponent implements OnInit {
  @Input() order;
  @Input() type = '';
  user;
  numOrders;
  cat;
  // eslint-disable-next-line prettier/prettier
  constructor(private route: ActivatedRoute, private admin: AdminCheckService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.cat = params.get('cat');
      this.parseOrder();
    });
  }

  parseOrder() {
    this.user = this.order[0];
    this.numOrders = Object.keys(this.order[1]).length;
    // this.getNumCustomOrders()
  }

  getNumCustomOrders() {
    const up = (this.cat.charAt(0).toUpperCase() + this.cat.slice(1)).replace('_', '-');
    const self = this;
    firebase.database().ref('Admin/' + up + '-custom/' + this.user).on('value', function(userCust) {
      self.numOrders += Object.keys(userCust.val()).length;
    });
  }
}
