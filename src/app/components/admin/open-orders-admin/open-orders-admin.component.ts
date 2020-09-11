import { Component, OnInit, Input } from '@angular/core';
import { AdminCheckService } from '../../../services/admin-check.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-open-orders-admin',
  templateUrl: './open-orders-admin.component.html',
  styleUrls: ['./open-orders-admin.component.scss']
})
export class OpenOrdersAdminComponent implements OnInit {
  constructor(private admin: AdminCheckService, private route: ActivatedRoute) { }
  uid;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.uid = params.get('uid')
    });

    document.getElementById('dashboard').classList.remove('active')
    document.getElementById('dashboard').style.color = 'black'

    document.getElementById('wishlist').classList.remove('active')
    document.getElementById('wishlist').style.color = 'black'

    document.getElementById('settings').classList.remove('active')
    document.getElementById('settings').style.color = 'black'

    document.getElementById("open-orders").classList.add('active');
    document.getElementById("open-orders").style.color = 'white'
  }
}
