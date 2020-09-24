import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-custom-user-order',
  templateUrl: './custom-user-order.component.html',
  styleUrls: ['./custom-user-order.component.scss']
})
export class CustomUserOrderComponent implements OnInit {
  @Input() order;
  @Input() uid;
  orderTime
  orderData;
  dueDate;
  dummyImg;
  currImgIndex = 0;
  currImg;
  customForm
  complexity
  printPrice;
  framePrice;
  servicePrice;
  needQuote = []
  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.parseOrder()
  }
  parseOrder() {
    let time = +(this.order[0])
    let date = new Date(time)
    this.orderTime = date.toString().split(" ")
    for (let i = 0; i < 4; i++) {
      this.orderTime.pop()
    }
    this.orderTime = this.orderTime.join(" ")
    this.orderData = this.order[1]
    let dueDate = new Date()
    dueDate.setFullYear(this.orderData.date.year, this.orderData.date.month - 1, this.orderData.date.day)
    this.dueDate = dueDate.toDateString().split(" ")
    this.dueDate.shift()
    this.dueDate = this.dueDate.join(" ")
    this.dummyImg = `../../../../../../assets/icons/${this.orderData.service.toLowerCase()}.png`
    this.currImg = this.orderData.imgs[0]
    this.customForm = this.formBuilder.group({
      name: this.orderData.name,
      email: this.orderData.email,
      phone: this.orderData.phone,
      service: this.orderData.service,
      printOpt: this.orderData.printOpt,
      desc: this.orderData.desc,
      size: this.orderData.size,
      otherService: this.orderData.otherService,
      otherSize: this.orderData.otherSize,
      imgs: this.orderData.imgs,
      date: this.orderData.date,
      servicePrice: this.orderData.servicePrice,
      printAndPosterPrice: this.orderData.printAndPosterPrice,
      complexity: this.orderData.complexity,
      printPrice: this.orderData.printPrice,
      framePrice: this.orderData.framePrice
    })
    this.complexity = this.orderData.complexity
    this.printPrice = this.orderData.printPrice
    this.framePrice = this.orderData.framePrice
    this.servicePrice = this.orderData.servicePrice
    if (this.complexity === "Quote Pending") {
      this.needQuote.push("complexity")
    }
    if (this.printPrice === "Quote Pending") {
      this.needQuote.push("printPrice")
    }
    if (this.framePrice === "Quote Pending") {
      this.needQuote.push("framePrice")
    }
    if (this.servicePrice === "Quote Pending") {
      this.needQuote.push("servicePrice")
    }
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

  move() {
    this.orderData.complexity = +(this.complexity) || this.orderData.complexity
    this.orderData.printPrice = +(this.printPrice) || this.orderData.printPrice
    this.orderData.framePrice = +(this.framePrice) || this.orderData.framePrice
    this.orderData.servicePrice = +(this.servicePrice) || this.orderData.servicePrice

    if (Object.values(this.orderData).indexOf("Quote Pending") < 0) {
      console.log("Ay okay")
    }
  }

  quoteChange(event, field) {
    this[field] = event.target.value
  }
}
