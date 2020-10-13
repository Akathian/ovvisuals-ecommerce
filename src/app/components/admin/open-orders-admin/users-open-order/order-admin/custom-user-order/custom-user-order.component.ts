import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { Email, emailBody } from '../../../../../../../assets/js/smtp.js';
import { environment } from '../../../../../../../environments/environment';
@Component({
  selector: 'app-custom-user-order',
  templateUrl: './custom-user-order.component.html',
  styleUrls: ['./custom-user-order.component.scss']
})
export class CustomUserOrderComponent implements OnInit {
  @Input() order;
  @Input() uid;
  @ViewChild('areYouSureCustom', { static: false }) areYouSureCustom: ModalDirective;
  cat;
  orderTime;
  orderData;
  dueDate;
  dummyImg;
  currImgIndex = 0;
  currImg;
  customForm;
  complexity;
  printPrice;
  framePrice;
  servicePrice;
  needQuote = [];
  moveTo;
  orderOwner;
  // eslint-disable-next-line prettier/prettier
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.cat = params.get('cat');
      if (this.cat === 'open_orders') {
        this.moveTo = 'in progress';
      } else if (this.cat === 'intermediate_orders') {
        this.moveTo = 'complete';
      }
      this.parseOrder();
    });
  }
  parseOrder() {
    const time = +(this.order[0]);
    const date = new Date(time);
    this.orderTime = date.toString().split(' ');
    for (let i = 0; i < 4; i++) {
      this.orderTime.pop();
    }
    this.orderTime = this.orderTime.join(' ');
    this.orderData = this.order[1];
    const dueDate = new Date();
    dueDate.setFullYear(this.orderData.date.year, this.orderData.date.month - 1, this.orderData.date.day);
    this.dueDate = dueDate.toDateString().split(' ');
    this.dueDate.shift();
    this.dueDate = this.dueDate.join(' ');
    this.dummyImg = `../../../../../../assets/icons/${this.orderData.service.toLowerCase()}.png`;
    if (this.orderData.imgs) {
      this.currImg = this.orderData.imgs[0];
    }
    this.complexity = this.orderData.complexity;
    this.printPrice = this.orderData.printPrice;
    this.framePrice = this.orderData.framePrice;
    this.servicePrice = this.orderData.servicePrice;

    if (this.complexity === 'Quote Pending') {
      this.needQuote.push('complexity');
    }
    if (this.printPrice === 'Quote Pending') {
      this.needQuote.push('printPrice');
    }
    if (this.framePrice === 'Quote Pending') {
      this.needQuote.push('framePrice');
    }
    if (this.servicePrice === 'Quote Pending') {
      this.needQuote.push('servicePrice');
    }
  }

  nextImg(inc) {
    this.currImgIndex = this.currImgIndex + inc;
    if (this.currImgIndex < 0) {
      this.currImgIndex = this.orderData.imgs.length - 1;
    }
    if (this.currImgIndex >= this.orderData.imgs.length) {
      this.currImgIndex = 0;
    }
    this.currImg = this.orderData.imgs[this.currImgIndex];
  }

  move() {
    if (!Number.isNaN(+(this.complexity))) {
      this.orderData.complexity = +(this.complexity);
    }
    if (!Number.isNaN(+(this.printPrice))) {
      this.orderData.printPrice = +(this.printPrice);
    }
    if (!Number.isNaN(+(this.framePrice))) {
      this.orderData.framePrice = +(this.framePrice);
    }
    if (!Number.isNaN(+(this.servicePrice))) {
      this.orderData.servicePrice = +(this.servicePrice);
    }
    if (Object.values(this.orderData).indexOf('Quote Pending') < 0) {
      this.areYouSureCustom.show();
    }
  }

  quoteChange(event, field) {
    this[field] = event.target.value;
  }

  moveToIntermediate() {
    const up = (this.cat.charAt(0).toUpperCase() + this.cat.slice(1)).replace('_', '-');
    firebase.database().ref('Admin/' + up + '-custom/' + this.uid + '/' + this.order[0]).remove();
    firebase.database().ref('Users/' + this.uid + '/' + up + '-custom/' + this.order[0]).remove();
    const updates = {};
    if (this.cat === 'open_orders') {
      updates['Admin/Intermediate-orders-custom/' + this.uid + '/' + this.order[0]] = this.orderData;
      updates['Users/' + this.uid + '/Intermediate-orders-custom/' + this.order[0]] = this.orderData;
      firebase.database().ref().update(updates);
    } else if (this.cat === 'intermediate_orders') {
      updates['Admin/Complete-orders-custom/' + this.uid + '/' + this.order[0]] = this.orderData;
      updates['Users/' + this.uid + '/Complete-orders-custom/' + this.order[0]] = this.orderData;
      firebase.database().ref().update(updates);
    }
    this.sendEmail(this.orderData);
  }

  hideAndReset() {
    this.areYouSureCustom.hide();
    for (let i = 0; i < this.needQuote.length; i++) {
      this[this.needQuote[i]] = 'Quote Pending';
      this.orderData[this.needQuote[i]] = 'Quote Pending';
    }
  }

  sendEmail(data) {
    const subject = 'OVVisuals Request Update';
    const title = `Hello ${data.name}`;
    // eslint-disable-next-line max-len
    const subHead = `Regarding your recent order with me, I've provided a quote with how much your request will cost. Have a look and reply to this email if you want to change anything!`;
    const self = this;
    const body = emailBody(data.imgs, subject, title, subHead, data);
    Email.send({
      SecureToken: environment.smtp.secure, // move to envir
      To: `${data.email}`,
      From: `${environment.smtp.from}`,
      Subject: subject,
      Body: body,
    }).then(
      message => {
        if (message === 'OK') {
          self.router.navigate(['/admin/' + self.cat], { relativeTo: this.route });
        }
      }
    );
  }
}
