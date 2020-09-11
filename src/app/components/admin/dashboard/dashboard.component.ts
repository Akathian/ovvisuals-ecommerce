import { Component, OnInit } from '@angular/core';
import { AdminCheckService } from '../../../services/admin-check.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private admin: AdminCheckService) { }

  ngOnInit() {
    document.getElementById('open-orders').classList.remove('active')
    document.getElementById('open-orders').style.color = 'black'

    document.getElementById('wishlist').classList.remove('active')
    document.getElementById('wishlist').style.color = 'black'

    document.getElementById('settings').classList.remove('active')
    document.getElementById('settings').style.color = 'black'

    document.getElementById("dashboard").classList.add('active');
    document.getElementById("dashboard").style.color = 'white'
  }

}
