import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('explainerAnim', [
      transition('* => *', [
        query('.anim', style({ opacity: 0, transform: 'translateX(-40px)' })),
        query('.anim', stagger('500ms', [
          animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ]))
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {

  // eslint-disable-next-line prettier/prettier
  constructor(private titleService: Title) {
    this.titleService.setTitle('Home | OVVisuals');
  }

  ngOnInit() {
    //
  }

}
