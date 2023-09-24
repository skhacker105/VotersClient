import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

  email = new FormControl<string>('', Validators.email);
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 600,
    navText: [],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      760: {
        items: 3
      },
      1000: {
        items: 4
      }
    },
    nav: false,
    autoplay: false,
    autoplayHoverPause: true,
    lazyLoad: true,
    autoplaySpeed: 1000,
    smartSpeed: 1000
  }
  constructor(public userService: UserService) { }
}
