import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-order',
  templateUrl: './custom-order.component.html',
  styleUrls: ['./custom-order.component.scss']
})
export class CustomOrderComponent implements OnInit {
  @Input() order;
  orderTime
  orderData
  dueDate;
  dummyImg;
  currImgIndex = 0;
  currImg;
  constructor() { }

  ngOnInit() {
    this.parseOrder()
  }
  parseOrder() {
    let date = new Date()
    date.setTime(this.order[0])
    this.orderTime = date.toDateString()
    this.orderData = this.order[1]
    let dueDate = new Date()
    dueDate.setFullYear(this.orderData.date.year, this.orderData.date.month - 1, this.orderData.date.day)
    this.dueDate = dueDate.toDateString().split(" ")
    this.dueDate.shift()
    this.dueDate = this.dueDate.join(" ")
    this.dummyImg = `../../../../../../assets/icons/${this.orderData.service.toLowerCase()}.png`
    this.currImg = this.orderData.imgs[0]
  }

  nextImg(inc) {
    this.currImgIndex = this.currImgIndex + inc
    if (this.currImgIndex < 0) {
      this.currImgIndex = this.orderData.imgs.length - 1
    }
    if (this.currImgIndex >= this.orderData.imgs.length) {
      this.currImgIndex = 0
    }
    this.currImg = this.orderData.imgs[this.currImgIndex]
  }
}
