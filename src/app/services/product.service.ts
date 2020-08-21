import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product'

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  posters: Product[] = [
    new Product(1, 'Kobe Bryant Poster', 'Poster of Kobe Bryant', 39, 'https://bit.ly/3hiENxB'),
    new Product(2, 'Eelam Poster', 'Poster of Tamil Eelam', 29, 'https://bit.ly/3hjnexv'),
    new Product(3, 'Iron Man Poster', 'Poster of Iron Man', 29, 'https://bit.ly/3iWIuJZ'),
    new Product(4, 'Pop Smoke Poster', 'Poster of Pop Smoke', 39, 'https://bit.ly/2EpPy2x'),
    new Product(5, 'Majin Buu Poster', 'Poster of Majin Buu', 39, 'https://bit.ly/2Yl8mXW'),
    new Product(6, 'Tiger Poster', 'Poster of a Tiger', 39, 'https://bit.ly/3gh3k4T'),
    new Product(7, 'Joker Poster', 'Poster of Joker', 59, 'https://bit.ly/3aIcTsw'),

  ]

  constructor() {
  }

  getPosters(): Product[] {
    return this.posters;
  }
}

