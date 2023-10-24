/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-undef */
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { NgxMasonryComponent } from 'ngx-masonry';
import { GalleryComponent } from '../../gallery/gallery.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @ViewChild(NgxMasonryComponent, { static: true }) masonry: NgxMasonryComponent;
  @ViewChild(GalleryComponent, {static: true}) galleryComponent: GalleryComponent
 
  isAdmin = false;
  debugMode = false;
  transitoned = false;

  @HostListener('wheel', ['$event'])
  onMouseWheel(event) {
    const self = this

    if (!this.transitoned) {
      const logoElem = document.getElementsByClassName("logodiv")[0]
      logoElem.classList.remove("logodiv");
      logoElem.classList.add("transformedNav")
      const gallery = document.getElementById("gallery")
      const oviya = document.getElementById("oviya")
      oviya.style.transform = 'translateY(-3.25em)'

      setTimeout(() => {
        gallery.classList.remove("d-none");
      }, 2000)
      this.transitoned = true;
    }
    console.log(this.galleryComponent)
  }

  ngOnInit() {
    // this.onLogin();
  }

  verifyAdmin() {
    const self = this;
    firebase.auth().onAuthStateChanged((user) => {
      try {
        firebase
          .database()
          .ref(`Admin/${user.uid}`)
          .once('value', (data) => {
            if (data.val()) {
              self.isAdmin = true;
              return self.isAdmin;
            }
            self.isAdmin = false;
            return self.isAdmin;
          });
      } catch (e) {
        self.isAdmin = false;
        return self.isAdmin;
      }
    });
    return this.isAdmin;
  }

  onLogin() {
    const self = this;
    firebase.auth().onAuthStateChanged(function (user) {
      const loginIMG = `<svg id='logoutImg' width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-person-circle"
      fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
          d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
      <path fill-rule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path fill-rule="evenodd"
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
  </svg>`;
      if (user) {
        if (user.photoURL) {
          document.getElementById(
            'login'
          ).innerHTML = `<img id='loginImg' src='${user.photoURL}' width='26px'/> `;
          document.getElementById('loginImg').style.borderRadius = '100%';
        } else {
          document.getElementById('logoutImg').style.fill = 'green';
        }
        firebase
          .database()
          .ref(`Users/${user.uid}/Cart/` + `itemQty`)
          .on('value', function (itemQtyData) {
            if (itemQtyData) {
              const currQty = itemQtyData.val();
              document.getElementById('lblCartCount').innerText = currQty;
            }
          });
      } else {
        document.getElementById('login').innerHTML = loginIMG;
        document.getElementById('lblCartCount').innerText = '';
      }
      self.isAdmin = self.verifyAdmin();
    });
  }

  toggleDebug() {
    const cssRule = '* { outline: 1px red solid; }';

    // Check if a style sheet already exists, or create a new one
    const styleSheet = document.styleSheets[0] as CSSStyleSheet;

    // Add the CSS rule to the style sheet
    if (styleSheet.insertRule && !this.debugMode) {
      styleSheet.insertRule(cssRule, 0);
      this.debugMode = true
    } else if (this.debugMode) {
      styleSheet.deleteRule(0);
      this.debugMode = false
    }
  }

}
