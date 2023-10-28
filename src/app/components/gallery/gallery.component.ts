/* eslint-disable max-len */
import { Component, OnInit, ViewChild, } from '@angular/core';
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
import { NavTransitionService } from 'src/app/services/nav-transition.service';


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
  currImages = [];
  subscription: Subscription;
  options = {
    transitionDuration: '1.2s',
		gutter: 10,
		resize: true,
		initLayout: true,
		fitWidth: true
  }

  
  // eslint-disable-next-line prettier/prettier 
  constructor(private lightbox: Lightbox, private lightboxEvent: LightboxEvent, private lighboxConfig: LightboxConfig, private _Activatedroute: ActivatedRoute, private titleService: Title, private navTransitionService: NavTransitionService) {
    this.lighboxConfig.fadeDuration = 1;
  }

  ngOnInit() {
    this.getGallery(); 
    const gallery = document.getElementById("gallery")

    const self = this
    this.navTransitionService.transitioned.subscribe((transitioned) => {
      if (transitioned) {
        gallery.classList.remove("d-none");
        self.masonry.reloadItems();
        self.masonry.layout();
      }
    });
  }

  getGallery() {
    const self = this
    firebase.database().ref('/Gallery_new/active').once('value', function (galData) {
      self.currImages = Object.values(galData.val());
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

