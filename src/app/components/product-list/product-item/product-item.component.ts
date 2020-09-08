import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/models/product'
import { MessengerService } from 'src/app/services/messenger.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() productItem: Product
  type: string;

  constructor(private _Activatedroute: ActivatedRoute) {
  }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.type = params.get('type');
    });
  }

}
