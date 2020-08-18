import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product'

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  products: Product[] = [
    new Product(1, 'Kobe Bryant Poster', 'Poster of Kobe Bryant', 39, '../../assets/Products/kobe1.png'),
    new Product(2, 'Eelam Poster', 'Poster of Tamil Eelam', 29, '../../assets/Products/eelam1.png'),
    new Product(3, 'Iron Man Poster', 'Poster of Iron Man', 29, '../../assets/Products/iron1.png'),
    new Product(4, 'Pop Smoke Poster', 'Poster of Pop Smoke', 39, '../../assets/Products/woo1.png'),
    new Product(5, 'Majin Buu Poster', 'Poster of Majin Buu', 39, '../../assets/Products/buu1.png'),
    new Product(6, 'Tiger Poster', 'Poster of a Tiger', 39, '../../assets/Products/tiger1.png'),
    new Product(7, 'Joker Poster', 'Poster of Joker', 59, '../../assets/Products/joker1.png'),

  ]

  constructor() {
  }

  getProducts(): Product[] {
    return this.products
  }
}
