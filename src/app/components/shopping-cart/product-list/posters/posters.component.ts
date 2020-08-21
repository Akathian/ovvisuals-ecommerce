import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'
import { Product } from 'src/app/models/product'

@Component({
  selector: 'app-posters',
  templateUrl: './posters.component.html',
  styleUrls: ['./posters.component.scss']
})
export class PostersComponent implements OnInit {

  posterList: Product[] = []

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.posterList = this.productService.getPosters();
  }

}
