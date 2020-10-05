import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'
import { Product } from 'src/app/models/product'
import { ActivatedRoute } from '@angular/router';
import { Title } from "@angular/platform-browser"

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  type: string;
  productList: {}[] = []
  cap;
  constructor(private productService: ProductService, private _Activatedroute: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.type = params.get('type');
      this.cap = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      this.renderProducts(this.type);
    });
  }

  ngAfterViewInit() {
    this.titleService.setTitle(this.cap + " | OVVisuals")
  }

  renderProducts(type: String) {
    this.productList = this.productService.getItemFromDB(type);
  }
}