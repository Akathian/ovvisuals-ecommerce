import { Component, OnInit } from '@angular/core';
import { AdminCheckService } from '../../../services/admin-check.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from "@angular/platform-browser"

@Component({
  selector: 'app-open-orders-admin',
  templateUrl: './open-orders-admin.component.html',
  styleUrls: ['./open-orders-admin.component.scss']
})
export class OpenOrdersAdminComponent implements OnInit {
  constructor(private admin: AdminCheckService, private route: ActivatedRoute, private titleService: Title) {
    this.titleService.setTitle("Admin | OVVisuals")
  }
  uid;
  cat;
  user;
  numOrders = 0
  userOrders = [];
  countTimes = 0;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.uid = params.get('uid')
      this.cat = params.get('cat')
      document.getElementById('dashboard').classList.remove('active')
      document.getElementById('dashboard').style.color = 'black'

      document.getElementById('complete_orders').classList.remove('active')
      document.getElementById('complete_orders').style.color = 'black'

      document.getElementById('open_orders').classList.remove('active')
      document.getElementById('open_orders').style.color = 'black'

      document.getElementById('intermediate_orders').classList.remove('active')
      document.getElementById('intermediate_orders').style.color = 'black'

      document.getElementById(this.cat).classList.add('active');
      document.getElementById(this.cat).style.color = 'white'
    });
  }


}
