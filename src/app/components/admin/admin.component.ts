import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase'
import { AdminCheckService } from '../../services/admin-check.service'
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isAdmin = false;
  cat;
  activePage;
  uid;
  constructor(private admin: AdminCheckService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.verifyAdmin();
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
