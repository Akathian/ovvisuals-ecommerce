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
    document.getElementById('open_orders').classList.remove('active')
    document.getElementById('open_orders').style.color = 'black'

    document.getElementById('intermediate_orders').classList.remove('active')
    document.getElementById('intermediate_orders').style.color = 'black'

    document.getElementById('settings').classList.remove('active')
    document.getElementById('settings').style.color = 'black'

    document.getElementById("dashboard").classList.add('active');
    document.getElementById("dashboard").style.color = 'white'
  }

}
