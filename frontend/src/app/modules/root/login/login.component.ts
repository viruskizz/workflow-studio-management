import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-main-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  errorMessage?: string;

  onSubmit() {
    const { username, password } = this.loginForm.value;
    if (username && password) {
      this.authService.signIn(username, password).subscribe((data: any) => {
        console.log('data', data);
        this.errorMessage = undefined;
        this.authService.saveLogin(data.access_token)
        this.router.navigate(['/main']);
      }, err => {
        console.log(err.error.message)
        this.errorMessage = `${err.error.error}: ${err.error.message}`
      })
    }
  }
}
