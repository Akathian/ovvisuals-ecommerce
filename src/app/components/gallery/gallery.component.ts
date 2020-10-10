import { Component, AfterViewInit, OnInit } from '@angular/core';
import { IAlbum, IEvent, Lightbox, LIGHTBOX_EVENT, LightboxConfig, LightboxEvent }
  from 'ngx-lightbox';
import { Title } from "@angular/platform-browser"
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
  private subscription: Subscription;
  constructor(private lightbox: Lightbox, private lightboxEvent: LightboxEvent, private lighboxConfig: LightboxConfig, private _Activatedroute: ActivatedRoute, private titleService: Title) {
    this.allImages = this.allImages ? this.allImages : [];
    this.lighboxConfig.fadeDuration = 1;
  }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.content = params.get('content');
      this.cap = this.content.charAt(0).toUpperCase() + this.content.slice(1);
      this.cap = this.cap.replace('-', ' ')
      this.cap = this.cap.replace('-', ' ')
      this.getGallery(this.content)
      this.titleService.setTitle("Gallery - " + this.cap + " | OVVisuals")
    });
  }
  ngAfterViewInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.titleService.setTitle("Gallery - " + this.cap + " | OVVisuals")
    });
  }

  getGallery(content) {
    let self = this
    if (!content) {
      content = 'all'
    }
    firebase.database().ref('/Gallery/' + content).on('value', function (galData) {
      self.allImages = self.shuffle(galData.val())
      self.chunks = self.chunk(self.allImages, 3)
      self.images1 = self.chunks[0]
      self.images2 = self.chunks[1]
      self.images3 = self.chunks[2]
    })
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  chunk(items, n) {
    const result = [[], [], []] //we create it, then we'll fill it
    const wordsPerLine = Math.ceil(items.length / 3)

    for (let line = 0; line < n; line++) {
      for (let i = 0; i < wordsPerLine; i++) {
        const value = items[i + line * wordsPerLine]
        if (!value) continue //avoid adding "undefined" values
        result[line].push(value)
      }
    }
    if ((result[1].length - result[2].length) > 1) {
      result[2].push(result[1].pop())
    }

    return result;
  }

  open(index: number, offs): void {
    let offsIndx = index + offs
    this.subscription = this.lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
    this.lightbox.open(this.allImages, offsIndx, { wrapAround: true, showImageNumberLabel: true });
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this.subscription.unsubscribe();
    }
  }

}
