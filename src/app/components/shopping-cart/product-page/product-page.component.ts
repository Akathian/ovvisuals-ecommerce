import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'
import { Product } from 'src/app/models/product'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  id: number;
  type: string;
  productList: Product[] = []
  product: Product;
  constructor(private productService: ProductService, private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.type = params.get('type');
      this.getProductsOfType(this.type);
      this.getIndividual();
    });
  }
  getProductsOfType(type: String) {
    switch (type) {
      case "posters": {
        this.productList = this.productService.getPosters();
        break;
      }
      case "paintings": {
        this.productList = this.productService.getPaintings();
        break;
      }
    }
  }

  getIndividual() {
    for (let i = 0; i < this.productList.length; i++) {
      if (this.productList[i].id === this.id) {
        this.product = this.productList[i];
      }
    }
  }
}
