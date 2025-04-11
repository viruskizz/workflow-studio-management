import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent {
  rememberMe = false;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    isRememberMe: new FormControl(true)
  })

  constructor(private layoutService: LayoutService, private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.loginForm.setErrors(null)
    console.log(this.loginForm)
    this.loginForm.disable()
    if (this.loginForm.invalid) {
      return;
    }
    const username = this.loginForm.value.username!;
    const password = this.loginForm.value.password!;
    this.authService.signIn(username, password).subscribe({
      next: (v) => {
        this.authService.saveLogin(v.access_token).subscribe(v => {
          this.router.navigate([''])
        });
      },
      error: (e) => {
        this.loginForm.enable()
        this.loginForm.setErrors({
          incorrect: e.error.message
        })
      }
    })
  }

  /**
   * Layout config
   */
  get dark(): boolean {
    return this.layoutService.config().colorScheme !== 'light';
  }
}
