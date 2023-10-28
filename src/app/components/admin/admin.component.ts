/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { ImgurService } from "src/app/services/imgur.service";
import { ImageTools } from "../../../assets/js/imgTools";
import * as firebase from "firebase/app";
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { AdminCheckService } from "src/app/services/admin-check.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IEvent, Lightbox, LIGHTBOX_EVENT, LightboxConfig, LightboxEvent }
  from 'ngx-lightbox';
import { Subscription } from "rxjs";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  uploadedNum = 0;
  numToUpload = 0;
  attachments = [];
  smallAttach = [];
  newActiveOrder = []
  newInactiveOrder = [];
  isAdmin = false;
  subscription: Subscription;


  constructor(private imgur: ImgurService, private admin: AdminCheckService, private route: ActivatedRoute, private router: Router, private lightbox: Lightbox, private lightboxEvent: LightboxEvent, private lighboxConfig: LightboxConfig) {}

  ngOnInit() {
    this.verifyAdmin();
    this.getGallery()
  }

  open(index: number, offs, arr): void {
    const offsIndx = index + offs;
    this.subscription = this.lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
    this.lightbox.open(arr, offsIndx, { wrapAround: true, showImageNumberLabel: true });
  }


  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this.subscription.unsubscribe();
    }
  }
  
  signOut() {
    firebase.auth().signOut();
  }

  verifyAdmin() {
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      try {
        firebase.database().ref('Admin/' + user.uid).once('value', (data) => {
          if (data.val()) {
            self.isAdmin = true;
          } else {
            self.router.navigate(['../'], { relativeTo: this.route });
          }
        });
      } catch (e) {
        self.router.navigate(['../'], { relativeTo: this.route });
      }
    });
  }

  moveToInactive(event) {
    const idx = event.target.id.replace("active-", "")
    this.newInactiveOrder.unshift(this.newActiveOrder[idx])
    this.newActiveOrder.splice(idx, 1)
  }

  moveToActive(event) {
    const idx = event.target.id.replace("inactive-", "")
    this.newActiveOrder.unshift(this.newInactiveOrder[idx])
    this.newInactiveOrder.splice(idx, 1)
  }
 drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  getGallery() {
    const self = this;
    firebase
      .database()
      .ref("/Gallery_new/active")
      .on("value", function (galData) {
        self.newActiveOrder = Object.values(galData.val());
    });
    firebase
      .database()
      .ref("/Gallery_new/inactive")
      .on("value", function (galData) {
        if (galData.val()) {
          self.newInactiveOrder = Object.values(galData.val());
        }
    });
  }

  updateGallery() {
    const updates = {};
    updates["Gallery_new/active"] = this.newActiveOrder;
    updates["Gallery_new/inactive"] = this.newInactiveOrder;
    firebase.database().ref().update(updates);
  }

  async handleFileInput(event) {
    let events = [];
    events = Object.values(event);
    let totalSize = 0;
    let typesCorrect = true;
    for (const file of events) {
      totalSize += file.size;
      if (file.type.indexOf("image") !== 0) {
        typesCorrect = false;
      }
    }
    if (typesCorrect && totalSize < 1024 * 1024 * 1024) {
      if (events) {
        if (events.length > 1) {
          $("#inputGroupFile01")
            .next(".custom-file-label")
            .html(`${events.length} files`);
        } else {
          $("#inputGroupFile01")
            .next(".custom-file-label")
            .html(`${events[0].name}`);
        }
      }
      this.numToUpload = events.length;
      this.recurseEvents(this, Object.values(event));
      this.createSmallAttach(this, Object.values(event));
    } else {
      alert("Please only upload images that total to less than 1mb");
    }
  }

  recurseEvents(self, events) {
    if (events.length === 0) {
      return;
    }
    const image = events[0];
    const reader = new FileReader();
    reader.readAsBinaryString(image);

    reader.onload = function () {
      const dataUri =
        "data:" + image.type + ";base64," + btoa(reader.result as string);
      const fileData = {
        name: image.name,
        data: dataUri,
      };
      self.attachments.push(fileData);
      events.shift();
      self.recurseEvents(self, events);
      return;
    };
  }

  createSmallAttach(self, events) {
    if (events.length === 0) {
      return;
    }
    const image = events[0];
    let resizeFile: File;
    ImageTools.resize(
      image,
      {
        width: Infinity, // maximum width
        height: Infinity, // maximum height
      },
      async function (blob) {
        // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
        const b: any = blob;
        b.lastModifiedDate = new Date();
        resizeFile = new File([blob], image.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        const reader = new FileReader();
        reader.readAsBinaryString(resizeFile);
        reader.onload = async function () {
          const dataUri =
            "data:" + image.type + ";base64," + btoa(reader.result as string);
          const fileData = {
            name: image.name,
            data: dataUri,
          };
          self.smallAttach.push(fileData);
          events.shift();
          self.createSmallAttach(self, events);
          if (self.smallAttach.length === self.numToUpload) {
            self.imgur.auth(self.smallAttach).then(() => {
              const newImages = []
              for (const newImage of self.imgur.uploadedImgs) {
                newImages.push({src: newImage, caption: ""})
              }
              self.newActiveOrder = newImages.concat(self.newActiveOrder)
            });
          }
          return;
        };
      }
    );
  }
}
