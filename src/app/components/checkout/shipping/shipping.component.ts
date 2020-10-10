import { Component, AfterViewChecked, OnInit, Input } from '@angular/core';
import * as firebase from "firebase"
import { Title } from "@angular/platform-browser"

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements AfterViewChecked, OnInit {
  d: Date = new Date();
  ship;
  @Input() lone = true;
  constructor(private titleService: Title) {
    if (this.lone) {
      this.titleService.setTitle("Shipping | OVVisuals")
    }
  }


  ngOnInit() {
    this.getShip()
  }

  ngAfterViewChecked() {
    this.calculateShip()
  }
  calculateShip() {
    let d1 = this.addWorkDays(this.d, 12, 5)
    let d2 = this.addWorkDays(this.d, 12, 6)
    document.getElementById('pickup').innerText = d2.toDateString() + " before 9:00p.m.";
    document.getElementById('hand-delivery').innerText = d1.toDateString() + " before 9:00p.m.";

    let d3Min = this.addWorkDays(this.d, 6, null)
    let d3Max = this.addWorkDays(this.d, 10, null)
    document.getElementById('standard').innerText = d3Min.toDateString() + ' - ' + d3Max.toDateString();

    let d4Min = this.addWorkDays(this.d, 4, null)
    let d4Max = this.addWorkDays(this.d, 6, null)
    document.getElementById('express').innerText = d4Min.toDateString() + ' - ' + d4Max.toDateString();
  }
  addWorkDays(startDate, days, roundToDay) {
    if (isNaN(days)) {
      return
    }
    if (!(startDate instanceof Date)) {
      return
    }
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
    var dow = startDate.getDay();
    var daysToAdd = parseInt(days);
    // If the current day is Sunday add one day
    if (dow == 0)
      daysToAdd++;
    // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
    if (dow + daysToAdd >= 6) {
      //Subtract days in current working week from work days
      var remainingWorkDays = daysToAdd - (5 - dow);
      //Add current working week's weekend
      daysToAdd += 2;
      if (remainingWorkDays > 5) {
        //Add two days for each working week by calculating how many weeks are included
        daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
        //Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
        if (remainingWorkDays % 5 == 0)
          daysToAdd -= 2;
      }
    }
    let d = new Date()
    d.setDate(startDate.getDate() + daysToAdd);
    if (roundToDay != null) {
      while (d.getDay() != roundToDay) {
        d.setDate(d.getDate() + 1);
      }
    }
    return d;
  }

  getShip() {
    let self = this
    firebase.database().ref("Shipping/").on('value', function (shipData) {
      self.ship = shipData.val()

    })
  }
}
