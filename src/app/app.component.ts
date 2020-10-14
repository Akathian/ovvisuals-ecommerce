import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ovvisuals-ecommerce';
  countDownDate = new Date("Oct 21, 2020 13:00:00").getTime();
  ngOnInit() {
    let self = this
    setInterval(function () {

      var now = new Date().getTime();
      var timeleft = self.countDownDate - now;
      var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
      document.getElementById("days").innerHTML = days + "D "
      document.getElementById("hours").innerHTML = hours + "H "
      document.getElementById("mins").innerHTML = minutes + "M "
      document.getElementById("secs").innerHTML = seconds + "S"
    }, 1000)
  }
}
