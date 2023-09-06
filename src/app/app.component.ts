import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'VotersClient';

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.trackLocationChange();
  }

  trackLocationChange() {
    if (!this.userService.hasLocationAccess.value) this.loadGeoLocation();
    this.watchPosition();
  }

  loadGeoLocation() {
    Geolocation.getCurrentPosition()
    .then(location => {
      this.userService.hasLocationAccess.next(location);
    })
    .catch(err => {
      console.log('Error = ', err)
      this.userService.hasLocationAccess.next(undefined);
    });
  }

  watchPosition() {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000
    };
    Geolocation.watchPosition({}, (pos, err) => {
      if (err) {
        this.userService.hasLocationAccess.next(undefined);
        console.log('Error while watching geo location = ', err)
      }
      this.userService.hasLocationAccess.next(pos === null ? undefined : pos);
      console.log('New Post = ', pos)
    });
  }
}
