import { Component, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements AfterViewInit {

  // eslint-disable-next-line prettier/prettier
  constructor(private titleService: Title) {
    this.titleService.setTitle('Privacy Policy | OVVisuals');
  }

  ngAfterViewInit() {
    //
  }
}
