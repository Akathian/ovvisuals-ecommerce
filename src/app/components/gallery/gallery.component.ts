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
  currImages = [];
  subscription: Subscription;
  transitioned = false;
  options = {
    transitionDuration: '1.2s',
		gutter: 10,
		resize: true,
		initLayout: true,
		fitWidth: true
  }
  numItems = 0;
  currIdx = 1;
  transitioning = true;
  galleryStructure = {
    ".": {
        "files": [],
        "watercolors": {
            "files": [
                "Screenshot_20200904-122104_Instagram.jpg",
                "Screenshot_20200904-122120_Instagram.jpg",
                "Screenshot_20200904-122133_Instagram.jpg",
                "Screenshot_20200904-122124_Instagram.jpg",
                "Screenshot_20200904-122147_Instagram.jpg",
                "Screenshot_20200904-122143_Instagram.jpg",
                "Screenshot_20200904-122130_Instagram.jpg",
                "117092271_1515057462015493_5444572033813428653_n.jpg",
                "Screenshot_20200904-122108_Instagram.jpg",
                "117904491_734179704099675_2422552156820759730_n.jpg",
                "104452916_2768985453329293_5322906944499794104_n.jpg",
                "117291560_2541778786134826_8561922847214786418_n.jpg",
                "Screenshot_20200904-122138_Instagram.jpg",
                "Screenshot_20200904-122116_Instagram.jpg",
                "Screenshot_20200904-122111_Instagram.jpg"
            ]
        },
        "glass-paints": {
            "files": [
                "133291308_403985940845292_4572108835456801667_n.jpg",
                "129717589_705243286786421_7538888792203085661_n.jpg",
                "IMG_3991.jpg",
                "130286588_962719397470590_5142716007388703533_n.jpg",
                "IMG_3149.jpg",
                "134457861_3393214217443762_4563789247932456550_n.jpg",
                "130234010_742805503316087_4461271123654116076_n.jpg"
            ]
        },
        "posters": {
            "files": [
                "72277641_868008120260323_765220464274102847_n.jpg",
                "Untitled_Artwork 10.jpg",
                "95008853_862726410913925_6444029205021333688_n.jpg",
                "Tiger.jpg",
                "prabakhar.jpg",
                "20200904-122257.jpg",
                "meet the woo.jpg",
                "Jaathavi Poster.jpg",
                "Joker.jpg",
                "IronMan 24x36.jpg",
                "kobe24.jpg",
                "Majin.jpg",
                "Untitled_Artwork 3.jpg",
                "EDB63C96-D2BF-4F3B-BB83-BBD35029D41B.jpg"
            ]
        },
        "social-awareness": {
            "files": [
                "97861043_536112020364801_8707608283306872187_n copy.jpg",
                "Screenshot_20200904-122038_Instagram.jpg",
                "105942284_2840891949343505_3910302397620154920_n.jpg"
            ]
        },
        "lamps": {
            "files": [
                "GGA2WjJ.jpg",
                "121040421-369572150846697-8179395787248856167-n.jpg",
                "6E5ti21.jpg",
                "118288710-872039809988327-5013842189352119279-n.jpg",
                "117408318-331494894881307-6450961782276248704-n.jpg",
                "117300682-622271195353065-2093009850100198108-n.jpg",
                "0CGz2YT.jpg",
                "IMG_4009.jpg",
                "4YCPySd.jpg",
                "4tCF4dd.jpg",
                "fOsr3l7.jpg",
                "DrbdXK0.jpg",
                "79S6XBY.jpg",
                "6l4e4oH.jpg",
                "120497754-661425694795339-8161225625022549686-n.jpg",
                "Q9ZsTID.jpg",
                "R0UPma9.jpg",
                "119157003-626996798014111-5640535602725735099-n.jpg"
            ]
        },
        "paintings": {
            "files": [
                "120067074_332375961512413_2746276457646381803_n.jpg"
            ]
        },
        "others": {
            "files": [
              "IMG_1655.jpg",
                "Weddigng Invite.jpg",
                "IMG_3280.jpg",
                "118042227_3341435292580153_3736985001265089089_n.jpg",
                "IMG_5320.jpg",
            ]
        },
        "pencil-and-inkings": {
            "files": [
                "Screenshot_20200904-122053_Instagram.jpg",
                "Screenshot_20200904-122023_Instagram.jpg",
                "Screenshot_20200904-122206_Instagram.jpg",
                "Screenshot_20200904-122059_Instagram.jpg",
                "Screenshot_20200904-122156_Instagram.jpg",
                "Screenshot_20200904-122152_Instagram.jpg",
                "Screenshot_20200904-122200_Instagram.jpg",
                "Screenshot_20200904-122203_Instagram.jpg",
                "Screenshot_20200904-122048_Instagram.jpg",
                "Screenshot_20200904-122032_Instagram.jpg",
                "117823682_223781725690274_8476338986781606388_n.jpg"
            ]
        },
        "portraits": {
            "files": [
                "F909Qcy.jpg",
                "117232680-673027453285704-7826911503186923596-n.jpg",
                "Untitled-Artwork-8.jpg",
                "Kruthika Portrait.jpg",
                "Untitled-Artwork-10.jpg",
                "120315616_341607023728751_2345541595609475359_n.jpg",
                "Vhysha (1) Bigger.jpg",
                "Untitled_Artwork 8.jpg",
                "118589260-195758541912243-7007980343232398064-n.jpg",
                "qi4N0b8.jpg",
                "custom.jpg",
                "Untitled-Artworkk.jpg",
                "Untitled-Artwork (1).jpg",
                "130761497_208219047448473_1418762750428794607_n.jpg",
                "Untitled-Artwork.jpg",
                "120972376-747168465862814-5967254359762665522-n.jpg",
                "79792889-451484095543854-2480193457095729361-n.jpg",
                "118246965-311102193456692-6425455804611335699-n.jpg",
                "Artwork21.jpg",
                "Arusshnavi2.jpg",
                "Birthday-Portrait.jpg",
                "Artwork30.jpg",
                "Sabeana.jpg",
                "118825212-686560528610374-8793156517157862567-n.jpg",
                "N9YczsQ.jpg",
                "120203859_121720496127114_1323461667955965008_n.jpg",
                "Untitled_Artwork 2 (1).jpg",
                "63fbneF.jpg",
                "Untitled_Artwork (1).jpg",
                "Nilanvel2.jpg",
                "79272645-1039812019709873-4247253998526262605-n.jpg",
                "Untitled_Artwork 3.jpg",
                "Arusshnavi.jpg",
                "Untitled_Artwork 2.jpg",
                "3OBeudR.jpg",
                "Untitled-Artwork2.jpg",
                "8x10.jpg",
                "Untitled_Artwork.jpg",
                "art.jpg",
                "Untitled-Artwork-2.jpg",
                "Untitled_Artwork 1.jpg",
                "119882482_417832882520214_524624545281748413_n.jpg",
                "116369646-352630652394330-5111824718805050159-n.jpg",
                "KOdUbVx.jpg",
                "75545969-561320111079830-4919997992790833929-n.jpg",
                "Untitled_Artwork 5.jpg",
                "Untitled_Artwork 4.jpg",
                "101244790-786316948566879-9081768222806188417-n.jpg",
                "120203606_950881458736059_7955119525107149300_n.jpg",
                "Untitled_Artwork 6.jpg",
                "Untitled-Artwork-4.jpg",
                "Untitled_Artwork 7.jpg"
            ]
        }
    }
  }
  
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
      // caret.style.transform = 'translateY(-300em)'
      caret.style.opacity = '0'

      setTimeout(() => {
        gallery.classList.remove("d-none");
        self.currIdx = Math.min(self.currIdx + 10, self.numItems)
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
    this.getGallery(this.content); 

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


    //   this.titleService.setTitle('Gallery - ' + this.cap + ' | OVVisuals');
    // });
  }


  ngAfterViewInit() {
    // this._Activatedroute.paramMap.subscribe(() => {
    //   this.titleService.setTitle('Gallery - ' + this.cap + ' | OVVisuals');
    // });
  }



  getGallery(content) {
    const galleryUrl = `${window.location.origin}/assets/gallery`
    const order = ["others", "glass-paints", "posters", "portraits", "social-awareness", "lamps", "paintings", "pencil-and-inkings", 'watercolors']
    for (const category of order) {
      const currList = []
      for (const img of this.galleryStructure["."][category]["files"]) {
        const imgUrl = `${galleryUrl}/${category}/${img}`
        currList.push({"src": imgUrl, "caption": "", "thumb": imgUrl })
      }
      this.currImages = this.currImages.concat(currList)
    }

    // const self = this
    // if (!content) {
    //   content = 'all';
    // }
  
    // firebase.database().ref('/Gallery/' + content).on('value', function (galData) {
    //   self.allImages = Object.values(galData.val());
    //   self.currImages = self.allImages
    //   console.log(self.currImages)
    // });

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

