import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as firebase from 'firebase'
import { ModalDirective } from 'angular-bootstrap-md'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() user;
  activePage = 'overview';
  @ViewChild('loginModal', { static: false }) loginModal: ModalDirective
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective

  constructor() { }

  ngOnInit() {
  }

  signOut() {
    if (this.loginModal) {
      this.loginModal.hide()
    }
    if (this.confirmModal) {
      this.confirmModal.hide()
    }
    firebase.auth().signOut();
  }

  changePage(page) {
    document.getElementById('overview').classList.remove('active')
    document.getElementById('orders').classList.remove('active')
    document.getElementById('wishlist').classList.remove('active')
    document.getElementById('settings').classList.remove('active')
    document.getElementById(page).classList.add('active');
    this.activePage = page
  }
}