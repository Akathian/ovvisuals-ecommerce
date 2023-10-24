/* eslint-disable max-len */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { IEvent, Lightbox, LIGHTBOX_EVENT, LightboxConfig, LightboxEvent }
  from 'ngx-lightbox';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { ActivatedRoute } from '@angular/router';

import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';
import { NgxMasonryComponent } from 'ngx-masonry';
import * as $ from "jquery";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-10px)', offset: 0 }),
            // style({ opacity: 0.5, transform: 'translateY(-25px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))
        ]))
      ])
    ])
  ]
})
export class GalleryComponent implements OnInit {
  @ViewChild(NgxMasonryComponent, { static: true }) masonry: NgxMasonryComponent;
  allImages;
  chunks;
  images1;
  images3;
  content;
  images2;
  cap;
  currImages;
  subscription: Subscription;
  transitioned = false;
  options = {
    horizontalOrder: true,
  }
  numItems = 0;
  currIdx = 1;
  transitioning = true;
  
  // eslint-disable-next-line prettier/prettier 
  constructor(private lightbox: Lightbox, private lightboxEvent: LightboxEvent, private lighboxConfig: LightboxConfig, private _Activatedroute: ActivatedRoute, private titleService: Title) {
    this.allImages = this.allImages ? this.allImages : [];
    this.lighboxConfig.fadeDuration = 1;
  }



  @HostListener('wheel', ['$event'])
  onMouseWheel(event) {
    this.doOnScroll()
  }

  @HostListener('scroll', ['$event'])
  onMouseScroll(event) {
    this.doOnScroll()
  }

  doOnScroll() {
    const self = this

    if (!this.transitioned) {
      const logoElem = document.getElementsByClassName("logodiv")[0]
      logoElem.classList.remove("logodiv");
      logoElem.classList.add("transformedNav")
      const gallery = document.getElementById("gallery")
      const oviya = document.getElementById("oviya")
      oviya.style.transform = 'translateY(-3.25em)'

      const caret = document.getElementById("caret")
      caret.style.transform = 'translateY(-400em)'

      setTimeout(() => {
        gallery.classList.remove("d-none");
        self.currIdx = Math.min(self.currIdx + 10, self.numItems)
        self.currImages = self.allImages
        self.masonry.reloadItems();
        self.masonry.layout();
        this.transitioning = false;
      }, 2000)
      this.transitioned = true;
    }
        // console.log(this.transitioned, Math.ceil($(window).scrollTop() + $(window).height()), $(document).height(), this.transitioning)
    // if (this.transitioned && !this.transitioning) {
    //   if(Math.ceil($(window).scrollTop() + $(window).height()) >= $(document).height()) {
    //     self.currIdx = Math.min(self.currIdx + 10, self.numItems)
    //     self.currImages = self.allImages.slice(0, self.currIdx);
    //     self.masonry.reloadItems();
    //     self.masonry.layout();
    //   }
    // }
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

    
    // const self = this;

    // this._Activatedroute.paramMap.subscribe(params => {
    //   this.content = params.get('content');
    //   this.cap = this.content.charAt(0).toUpperCase() + this.content.slice(1);
    //   this.cap = this.cap.replace('-', ' ');
    //   this.cap = this.cap.replace('-', ' ');
    this.getGallery(this.content); 


    //   this.titleService.setTitle('Gallery - ' + this.cap + ' | OVVisuals');
    // });
  }


  ngAfterViewInit() {
    // this._Activatedroute.paramMap.subscribe(() => {
    //   this.titleService.setTitle('Gallery - ' + this.cap + ' | OVVisuals');
    // });
  }



  getGallery(content) {
    const self = this;
    if (!content) {
      content = 'all';
    }
    firebase.database().ref('/Gallery/' + content).on('value', function (galData) {
      self.allImages = Object.values(galData.val());
      self.currImages = self.allImages
    });
  }


  open(index: number, offs): void {
    const offsIndx = index + offs;
    this.subscription = this.lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
    this.lightbox.open(this.currImages, offsIndx, { wrapAround: true, showImageNumberLabel: true });
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this.subscription.unsubscribe();
    }
  }

}

