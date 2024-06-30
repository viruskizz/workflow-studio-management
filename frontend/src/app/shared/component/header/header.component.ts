import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
  username = 'Anonymous';
  imageUrl = 'assets/images/avatar-default.jpg';

  constructor(private userService: UserService) {}

  ngOnInit() {
    // this.userService.getUser()
    // AuthService.getProfile();
    const profile = AuthService.getProfile();
    console.log(profile);
    this.userService.getUser(profile.sub).subscribe(res => {
      console.log(res);
      if (res.imageUrl) {
        this.imageUrl = res.imageUrl;
      }
      this.username = res.username;
    })
  }
}
