import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product'
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase'



@Injectable({
  providedIn: 'root'
})

export class ProductService {
  tmpItem: {}[] = [{}];
  user: {} = {};
  userCart: {}[] = [{}];


  constructor(private af: AngularFireDatabase) {
  }

  getCart() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.af.list('/Users/' + user.uid + '/Cart').valueChanges().subscribe(s => {
          self.userCart[0] = s
        })
      } else {
        self.userCart[0] = [{}]
      }
    })
    return this.userCart
  }

  getItemFromDB(type): {}[] {
    let t = type.charAt(0).toUpperCase() + type.slice(1);
    let url = '/Products/' + t
    this.af.list(url).valueChanges().subscribe(s => {
      this.tmpItem[0] = s
      return this.tmpItem
    }
    );
    return this.tmpItem
  }

  writeToDB(url, data) {
    this.af.list(url).push(data);
  }

  getUserFromDB(url) {
    this.af.list(url).valueChanges().subscribe(s => {
      this.user = s
      return this.user;
    })
    return this.user;
  }

}


