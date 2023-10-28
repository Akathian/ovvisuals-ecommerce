import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import 'firebase/database';
import 'firebase/auth';
import { NgxMasonryComponent } from 'ngx-masonry';
import { GalleryComponent } from '../../gallery/gallery.component';
import * as $ from "jquery";
import { NavTransitionService } from 'src/app/services/nav-transition.service';

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
  transitioned = false;
  currIdx: number;

  constructor (private navTransitionService: NavTransitionService) {

  }
  @HostListener('wheel', ['$event'])
  onMouseWheel() {
    this.doOnScroll()
  }

  @HostListener('scroll', ['$event'])
  onMouseScroll() {
    this.doOnScroll()
  }

  doOnScroll() {
    const self = this

    if (!this.transitioned) {
      const logoElem = document.getElementsByClassName("logodiv")[0]
      logoElem.classList.remove("logodiv");
      logoElem.classList.add("transformedNav")
      const oviya = document.getElementById("oviya")
      oviya.style.transform = 'translateY(-3.25em)'

      const caret = document.getElementById("caret")
      caret.style.opacity = '0'

      setTimeout(() => {
        self.navTransitionService.transitioned.next(true);
      }, 2000)
      self.transitioned = true;
      sessionStorage.setItem("oviyabose-navTransition", "true");
    }
  }

  ngOnInit() {
    const self = this
    $(document).ready(function(){
      const ua = navigator.userAgent;
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(ua)) {
        setTimeout(() => {
          self.doOnScroll()
        }, 2000)
      }
    })

    if (sessionStorage.getItem("oviyabose-navTransition") === "true") {
      self.navTransitionService.transitioned.next(true);
      const logoElem = document.getElementById("logodiv")
      const oviya = document.getElementById("oviya")
      const caret = document.getElementById("caret")

      logoElem.style.height = "7vh"
      oviya.style.transform = 'translateY(-3.25em)'
      caret.style.opacity = '0'
    }
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
