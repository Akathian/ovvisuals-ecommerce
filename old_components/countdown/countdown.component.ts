import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit {
  constructor() {}

  countDownDate = new Date('Oct 21, 2020 13:00:00').getTime();
  ngOnInit() {
    
    const self = this;
    setInterval(function () {
      const now = new Date().getTime();
      const timeleft = self.countDownDate - now;
      const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
      document.getElementById('days').innerHTML = days + 'D ';
      document.getElementById('hours').innerHTML = hours + 'H ';
      document.getElementById('mins').innerHTML = minutes + 'M ';
      document.getElementById('secs').innerHTML = seconds + 'S';
    }, 1000);
  }
}
