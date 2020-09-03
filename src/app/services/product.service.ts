import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product'
import { AngularFireDatabase } from '@angular/fire/database';



@Injectable({
  providedIn: 'root'
})

export class ProductService {
  tmpItem: {}[] = [{}];
  user: {} = {};


  paintings: Product[] = [
    new Product(8, 'Kid Goku Painting', "Paintings", 'Painting of Kid Goku', 59, 'https://instagram.fybz2-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/117092271_1515057462015493_5444572033813428653_n.jpg?_nc_ht=instagram.fybz2-1.fna.fbcdn.net&_nc_cat=101&_nc_ohc=EOLLDRgbwOEAX9X8kBO&oh=2f8b442f93d3ff2b92bcb1864c2f9ad7&oe=5F6C3639'),
    new Product(9, 'Rose Painting', "Paintings", 'Painting of a Rose', 29, 'https://instagram.fybz2-2.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/117823682_223781725690274_8476338986781606388_n.jpg?_nc_ht=instagram.fybz2-2.fna.fbcdn.net&_nc_cat=102&_nc_ohc=fWps9RUxr1UAX_TXK5a&oh=9655b5b3350576d238fa30a99d687ebb&oe=5F6A4DEB'),
    new Product(10, 'Shego Painting', "Paintings", 'Painting of Shego', 59, 'https://instagram.fybz2-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/117904491_734179704099675_2422552156820759730_n.jpg?_nc_ht=instagram.fybz2-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=Wo1xTuZOSi4AX8_XNNe&oh=0171938d3007dd7199e24d4a67441e11&oe=5F6DD6F0'),
    new Product(11, 'Deku Painting', "Paintings", 'Painting of Deku', 69, 'https://instagram.fymy1-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/117291560_2541778786134826_8561922847214786418_n.jpg?_nc_ht=instagram.fymy1-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=f7Gv8Ekm7agAX_EkoYW&oh=3a757227d7f1e314217d03146bb53bae&oe=5F6A9F86'),
    new Product(12, 'Tiger Painting', "Paintings", 'Painting of a Tiger', 69, 'https://instagram.fybz2-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/104452916_2768985453329293_5322906944499794104_n.jpg?_nc_ht=instagram.fybz2-1.fna.fbcdn.net&_nc_cat=101&_nc_ohc=GtZLYvM-6AEAX-oDs2j&oh=cdaa92e041c9eda6c4c34e3c18d83a8c&oe=5F6C8B00'),


  ]

  constructor(private af: AngularFireDatabase) {
  }

  getPaintings(): Product[] {
    return this.paintings;
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


