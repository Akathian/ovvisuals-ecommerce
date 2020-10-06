import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { AdminCheckService } from '../../services/admin-check.service'
import { Title } from "@angular/platform-browser"

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  isAdmin = false;
  cat;
  activePage;
  uid;
  constructor(private admin: AdminCheckService, private route: ActivatedRoute, private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.verifyAdmin();
  }

  ngAfterViewInit() {
    this.titleService.setTitle("Home | OVVisuals")
  }

  verifyAdmin() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      try {
        firebase.database().ref('Admin/' + user.uid).once('value', (data) => {
          if (data.val()) {
            self.isAdmin = true
            self.route.paramMap.subscribe(params => {
              self.cat = params.get('cat');
              self.uid = params.get('uid')
              if (!self.cat) {
                self.cat = 'dashboard'
              }
              self.admin.getInfo()
            });
          } else {
            self.router.navigate(['../'], { relativeTo: this.route });
          }
        })
      } catch (e) {
        self.router.navigate(['../'], { relativeTo: this.route });
      }
    })
  }
}
