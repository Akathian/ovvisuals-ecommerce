/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';



@Injectable({
  providedIn: 'root'
})

export class ProductService {
  tmpItem: {}[] = [{}];
  user: {} = {};
  userCart: {}[] = [{}];


  // eslint-disable-next-line prettier/prettier
  constructor(public af: AngularFireDatabase) {
  }

  getCart() {
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        self.af.list('/Users/' + user.uid + '/Cart').valueChanges().subscribe(s => {
          self.userCart[0] = s;
        });
      } else {
        self.userCart[0] = [{}];
      }
    });
    return this.userCart;
  }

  getItemFromDB(type): {}[] {
    const t = type.charAt(0).toUpperCase() + type.slice(1);
    const url = '/Products/' + t;
    this.af.list(url).valueChanges().subscribe(s => {
      this.tmpItem[0] = s;
      return this.tmpItem;
    }
    );
    return this.tmpItem;
  }

  writeToDB(url, data) {
    this.af.list(url).push(data);
  }

  getUserFromDB(url) {
    this.af.list(url).valueChanges().subscribe(s => {
      this.user = s;
      return this.user;
    });
    return this.user;
  }

}


