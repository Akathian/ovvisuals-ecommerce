import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'
import { Product } from 'src/app/models/product'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  type: string;
  productList: [][] = []
  constructor(private productService: ProductService, private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.type = params.get('type');
      this.renderProducts(this.type);
    });
  }

  renderProducts(type: String) {
    this.productList = this.productService.getItemFromDB(type);

  }
}

