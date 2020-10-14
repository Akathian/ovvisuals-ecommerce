/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ImageTools } from '../../assets/js/imgTools';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/functions';
@Injectable({
  providedIn: 'root',
})
export class ImgurService {
  access = 'aa';

  albumName;

  files;

  uploadedImgs = [];

  imgsHTML = '';

  constructor() {
    //
  }

  async auth(files) {
    const imgurUpload = firebase.functions().httpsCallable('imgurUpload');
    const respData = (await imgurUpload(files)).data;
    this.uploadedImgs = respData.uploadedImgs;
    this.imgsHTML = respData.imgsHTML;
  }
}
