import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-orders',
  templateUrl: './custom-orders.component.html',
  styleUrls: ['./custom-orders.component.scss'],
})
export class CustomOrdersComponent implements OnInit {
  // eslint-disable-next-line prettier/prettier
  @Input() user;
  requests = [];
  constructor() {
    //
  }

  ngOnInit() {
    //
  }
}
