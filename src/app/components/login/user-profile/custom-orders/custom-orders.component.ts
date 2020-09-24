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

  }

}
