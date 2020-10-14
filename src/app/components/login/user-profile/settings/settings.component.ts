import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  // eslint-disable-next-line prettier/prettier
  @Input() user;

  constructor() {
    //
  }

  ngOnInit() {
    //
  }
}
