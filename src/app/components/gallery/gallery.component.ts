/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { IEvent, Lightbox, LIGHTBOX_EVENT, LightboxConfig, LightboxEvent }
  from 'ngx-lightbox';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { ActivatedRoute } from '@angular/router';

import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

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
  allImages;
  chunks;
  images1;
  images2;
  images3;
  content;
  cap;
  subscription: Subscription;
  options = {
    horizontalOrder: true,
  }
  // eslint-disable-next-line prettier/prettier 
  constructor(private lightbox: Lightbox, private lightboxEvent: LightboxEvent, private lighboxConfig: LightboxConfig, private _Activatedroute: ActivatedRoute, private titleService: Title) {
    this.allImages = this.allImages ? this.allImages : [];
    this.lighboxConfig.fadeDuration = 1;
  }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.content = params.get('content');
      this.cap = this.content.charAt(0).toUpperCase() + this.content.slice(1);
      this.cap = this.cap.replace('-', ' ');
      this.cap = this.cap.replace('-', ' ');
      this.getGallery(this.content);
      this.titleService.setTitle('Gallery - ' + this.cap + ' | OVVisuals');
    });
  }
  ngAfterViewInit() {
    this._Activatedroute.paramMap.subscribe(() => {
      this.titleService.setTitle('Gallery - ' + this.cap + ' | OVVisuals');
    });
  }

  getGallery(content) {
    const self = this;
    if (!content) {
      content = 'all';
    }
    firebase.database().ref('/Gallery/' + content).on('value', function (galData) {
      self.allImages = Object.values(galData.val()).reverse();
    });
  }


  open(index: number, offs): void {
    const offsIndx = index + offs;
    this.subscription = this.lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
    this.lightbox.open(this.allImages, offsIndx, { wrapAround: true, showImageNumberLabel: true });
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this.subscription.unsubscribe();
    }
  }

}
