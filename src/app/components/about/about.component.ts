import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from "@angular/platform-browser"

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle("Home | OVVisuals")
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
