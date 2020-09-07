import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @Input() user;

  constructor() { }

  ngOnInit() {
  }

}
