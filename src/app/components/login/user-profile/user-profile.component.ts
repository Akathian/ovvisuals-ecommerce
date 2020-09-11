import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as firebase from 'firebase'
import { ModalDirective } from 'angular-bootstrap-md'
import * as $ from 'jquery'

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
    document.getElementById('overview').style.color = 'black'

    document.getElementById('open-orders').classList.remove('active')
    document.getElementById('open-orders').style.color = 'black'

    document.getElementById('wishlist').classList.remove('active')
    document.getElementById('wishlist').style.color = 'black'

    document.getElementById('settings').classList.remove('active')
    document.getElementById('settings').style.color = 'black'

    document.getElementById(page).classList.add('active');
    document.getElementById(page).style.color = 'white'

    this.activePage = page
  }
}