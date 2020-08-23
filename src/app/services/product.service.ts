import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product'

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  posters: Product[] = [
    new Product(1, 'Kobe Bryant Poster', "Poster", 'Poster of Kobe Bryant', 39, ''),
    new Product(2, 'Eelam Poster', "Poster", 'Poster of Tamil Eelam', 29, ''),
    new Product(3, 'Iron Man Poster', "Poster", 'Poster of Iron Man', 29, ''),
    new Product(4, 'Pop Smoke Poster', "Poster", 'Poster of Pop Smoke', 39, ''),
    new Product(5, 'Majin Buu Poster', "Poster", 'Poster of Majin Buu', 39, ''),
    new Product(6, 'Tiger Poster', "Poster", 'Poster of a Tiger', 39, ''),
    new Product(7, 'Joker Poster', "Poster", 'Poster of Joker', 59, ''),
  ]

  paintings: Product[] = [
    new Product(8, 'Kid Goku Painting', "Painting", 'Painting of Kid Goku', 39, ''),
  ]

  products: Product[][] = [
    this.posters
  ]
  constructor() {
  }

  getPosters(): Product[] {
    return this.posters;
  }

  getPaintings(): Product[] {
    return this.paintings;
  }

  getAll(): Product[][] {
    return this.products;
  }
}

