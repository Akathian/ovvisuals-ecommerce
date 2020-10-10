import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Title } from "@angular/platform-browser"

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle("Subscribe | OVVisuals")
  }

  ngOnInit() {
    this.fill()
  }
  fill() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let emailForm = <HTMLInputElement>document.getElementById("mce-EMAIL")
        emailForm.value = user.email
        let nameForm = <HTMLInputElement>document.getElementById("mce-FNAME")
        let lnameForm = <HTMLInputElement>document.getElementById("mce-LNAME")
        nameForm.value = user.displayName.split(' ')[0]
        lnameForm.value = user.displayName.split(' ')[1]
      }
    }
    )
  }
}
