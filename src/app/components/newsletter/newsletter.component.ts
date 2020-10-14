import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  // eslint-disable-next-line prettier/prettier
  constructor(private titleService: Title) {
    this.titleService.setTitle('Subscribe | OVVisuals');
  }

  ngOnInit() {
    this.fill();
  }
  fill() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const emailForm = document.getElementById('mce-EMAIL') as HTMLInputElement;
        emailForm.value = user.email;
        const nameForm = document.getElementById('mce-FNAME') as HTMLInputElement;
        const lnameForm = document.getElementById('mce-LNAME') as HTMLInputElement;
        nameForm.value = user.displayName.split(' ')[0];
        lnameForm.value = user.displayName.split(' ')[1];
      }
    }
    );
  }
}
