import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product'

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  products: Product[] = [
    new Product(1, 'Product1', 'This is product 1 description', 39, 'https://images.saatchiart.com/saatchi/976708/art/5789653/4859453-DPDBIBXN-7.jpg'),
    new Product(2, 'Product2', 'This is product 2 description', 29, 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/poppyscape-sunset-impasto-palette-knife-acrylic-painting-mona-edulesco-mona-edulesco.jpg'),
    new Product(3, 'Product3', 'This is product 3 description', 59, 'https://i0.wp.com/stepbysteppainting.net/wp-content/uploads/2019/01/img_3259-e1546635144542.jpg?resize=619%2C800&ssl=1'),
    new Product(4, 'Product4', 'This is product 4 description', 39, 'https://media.overstockart.com/optimized/cache/data/product_images/MU925-1000x1000.jpg'),
    new Product(5, 'Product5', 'This is product 5 description', 39, 'https://cdn.evbuc.com/eventlogos/92542003/bonsainew.jpg'),
    new Product(6, 'Product6', 'This is product 6 description', 39, 'https://images.unsplash.com/photo-1541512416146-3cf58d6b27cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'),
    new Product(7, 'Product7', 'This is product 7 description', 39, 'https://s3fs.paintnite.com/yaymaker-images/nite-out/original/8786-andromeda-flower.jpg')
  ]

  constructor() {
  }

  getProducts(): Product[] {
    return this.products
  }
}
