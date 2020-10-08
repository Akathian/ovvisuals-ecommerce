import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() user;
  wishListNum = 0;
  openCount;
  interCount;
  completeCount;

  constructor() { }

  ngOnInit() {
    this.wishListNum = this.getWishListNum()
    this.openCount = this.getOpenNum()
    this.interCount = this.getInterNum()
    this.completeCount = this.getCompleteNum()
  }
  getWishListNum() {
    let self = this
    if (this.user) {
      firebase.database().ref('/Users/' + this.user.uid + '/Wishlist/itemQty').on('value', function (itemQty) {
        self.wishListNum = itemQty.val() || 0
      })
    } else {
      self.wishListNum = 0
    }
    return this.wishListNum
  }

  getOpenNum() {
    let self = this
    if (this.user) {
      firebase.database().ref("Users/" + this.user.uid + "/Open-orders").on('value', function (orderData) {
        try { self.openCount = Object.entries(orderData.val()).length || 0 }
        catch (e) { self.openCount = 0 }
      })
      firebase.database().ref("Users/" + this.user.uid + "/Open-orders-custom").on('value', function (orderData) {
        try { self.openCount += Object.entries(orderData.val()).length || 0 }
        catch (e) { self.openCount += 0 }
      })
    } else {
      self.openCount = 0
    }
    return this.openCount
  }

  getInterNum() {
    let self = this
    if (this.user) {
      firebase.database().ref("Users/" + this.user.uid + "/Intermediate-orders").on('value', function (orderData) {
        try { self.interCount = Object.entries(orderData.val()).length || 0 }
        catch (e) { self.interCount = 0 }
      })
      firebase.database().ref("Users/" + this.user.uid + "/Intermediate-orders-custom").on('value', function (orderData) {
        try { self.interCount += Object.entries(orderData.val()).length || 0 }
        catch (e) { self.interCount += 0 }
      })
    } else {
      self.interCount = 0
    }
    return this.interCount
  }

  getCompleteNum() {
    let self = this
    if (this.user) {
      firebase.database().ref("Users/" + this.user.uid + "/Complete-orders").on('value', function (orderData) {
        try { self.completeCount = Object.entries(orderData.val()).length || 0 }
        catch (e) { self.completeCount = 0 }
      })
      firebase.database().ref("Users/" + this.user.uid + "/Complete-orders-custom").on('value', function (orderData) {
        try { self.completeCount += Object.entries(orderData.val()).length || 0 }
        catch (e) { self.completeCount += 0 }
      })
    } else {
      self.completeCount = 0
    }
    return this.completeCount
  }
}

