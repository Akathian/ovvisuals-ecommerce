
import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() productItem;

  type: string;

  // eslint-disable-next-line prettier/prettier
  constructor(private route: ActivatedRoute) {
    //
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type');
    });
  }

}
