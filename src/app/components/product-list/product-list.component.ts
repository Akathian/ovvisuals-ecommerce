/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 })),
        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-10px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))
        ]))
      ])
    ])
  ]
})
export class ProductListComponent implements OnInit, AfterViewInit {
  type: string;
  productList: {}[] = [];
  cap;
  len;
  // eslint-disable-next-line prettier/prettier
  constructor(private productService: ProductService, private _Activatedroute: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {

    this._Activatedroute.paramMap.subscribe(params => {
      this.type = params.get('type');
      this.cap = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      this.renderProducts(this.type);
    });
  }

  ngAfterViewInit() {
    this.titleService.setTitle(this.cap + ' | OVVisuals');

  }

  renderProducts(type: string) {
    this.productList = this.productService.getItemFromDB(type);
  }
}
