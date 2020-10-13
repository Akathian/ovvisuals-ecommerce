import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { ModalDirective } from 'angular-bootstrap-md';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() user;
  activePage = 'overview';
  @ViewChild('loginModal', { static: false }) loginModal: ModalDirective;
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;
  cat;
  cap;
  // eslint-disable-next-line prettier/prettier
  constructor(private _Activatedroute: ActivatedRoute, private titleService: Title) {
    this._Activatedroute.paramMap.subscribe(() => {
      this.titleService.setTitle('Account - ' + this.cap + ' | OVVisuals');
    });
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.cat = params.get('cat');
      if (!this.cat) {
        this.cat = 'overview';
      }
      this.cap = this.cat.charAt(0).toUpperCase() + this.cat.slice(1);
      this.cap = this.cap.replaceAll('-', ' ', );
      this.changePage(this.cat);
      this.titleService.setTitle('Account - ' + this.cap + ' | OVVisuals');

    });
  }

  signOut() {
    if (this.loginModal) {
      this.loginModal.hide();
    }
    if (this.confirmModal) {
      this.confirmModal.hide();
    }
    firebase.auth().signOut();
  }

  changePage(page) {
    document.getElementById('overview').classList.remove('bg-dark');
    document.getElementById('overview').style.color = 'black';

    document.getElementById('open-orders').classList.remove('bg-dark');
    document.getElementById('open-orders').style.color = 'black';

    document.getElementById('intermediate-orders').classList.remove('bg-dark');
    document.getElementById('intermediate-orders').style.color = 'black';

    document.getElementById('complete-orders').classList.remove('bg-dark');
    document.getElementById('complete-orders').style.color = 'black';

    document.getElementById('wishlist').classList.remove('bg-dark');
    document.getElementById('wishlist').style.color = 'black';

    document.getElementById('settings').classList.remove('bg-dark');
    document.getElementById('settings').style.color = 'black';

    document.getElementById(page).classList.add('bg-dark');
    document.getElementById(page).style.color = 'white';

    this.activePage = page;
  }
}
