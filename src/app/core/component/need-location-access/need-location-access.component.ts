import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-need-location-access',
  templateUrl: './need-location-access.component.html',
  styleUrls: ['./need-location-access.component.scss']
})
export class NeedLocationAccessComponent implements OnInit {
  title = 'VotersClient';

  constructor(public userService: UserService) {}

  ngOnInit(): void {
  }

  requestGeoLocation() {
    Geolocation.requestPermissions()
    .then(permStatus => {
      console.log('permStatus = ', permStatus);
    })
    .catch(err => {
      console.log('Error = ', err)
      this.userService.hasLocationAccess.next(undefined);
    });
  }
}
