import { Component, AfterViewInit } from '@angular/core';
import { Title } from "@angular/platform-browser"

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements AfterViewInit {

  constructor(private titleService: Title) { }

  ngAfterViewInit() {
    this.titleService.setTitle("Privacy Policy | OVVisuals")
  }
}
