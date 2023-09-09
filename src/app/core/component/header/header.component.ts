import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public userService: UserService, private router: Router) {}

  logout() {
    this.userService.clearSession();
    this.router.navigateByUrl('/login')
  }

  gotoAddDiscussion() {
    this.router.navigateByUrl('/home/addDiscussion')
  }
}
