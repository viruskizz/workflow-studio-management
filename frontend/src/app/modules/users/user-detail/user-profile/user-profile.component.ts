import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})

export class UserProfileComponent implements OnInit {
  userId: number = 0;
  user: User = {} as User;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
    });

    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
    });
  }
}
