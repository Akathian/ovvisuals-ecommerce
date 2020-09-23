import { Component, OnInit, Input } from '@angular/core';
import * as firebase from "firebase"
@Component({
  selector: 'app-custom-orders',
  templateUrl: './custom-orders.component.html',
  styleUrls: ['./custom-orders.component.scss']
})
export class CustomOrdersComponent implements OnInit {
  @Input() user;
  requests = []
  constructor() { }

  ngOnInit() {
    this.getCustoms();
  }
  getCustoms() {
    let self = this
    firebase.database().ref("Users/" + self.user.uid + "/Custom-requests/").on('value', function (customData) {
      self.requests = Object.entries(customData.val()).reverse()
      console.log(self.requests)
    })
  }
}
