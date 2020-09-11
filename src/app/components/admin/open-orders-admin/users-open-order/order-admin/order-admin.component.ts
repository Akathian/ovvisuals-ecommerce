import { Component, OnInit, Input } from '@angular/core';
import { AdminCheckService } from '../../../../../services/admin-check.service'
@Component({
  selector: 'app-order-admin',
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.scss']
})
export class OrderAdminComponent implements OnInit {
  @Input() uid;
  orders;
  times = 0;
  constructor(private admin: AdminCheckService) { }

  ngOnInit() {
    this.times = 0;
  }

  getOrdersByUid(uid) {
    if (!this.times) {
      if (uid != "all") {
        this.orders = Object.entries(this.admin.fullOpenOrderObj[uid])
      } else {
        this.orders = Object.entries(this.admin.allOrders).sort(
          function (a, b) {
            let c: number
            c = +(b[0]) - +(a[0])
            return c
          }
        )
        console.log(this.orders)
      }
      this.times++;
    }
  }

}
