import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() user;
  wishListNum = 0;
  constructor() { }

  ngOnInit() {
    this.wishListNum = this.getWishListNum()
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
}

