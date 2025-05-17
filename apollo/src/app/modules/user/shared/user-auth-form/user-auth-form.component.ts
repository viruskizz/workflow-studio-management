import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FdnetService } from 'src/app/services/fdnet.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-auth-form',
  templateUrl: './user-auth-form.component.html',
})
export class UserAuthFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) mode?: 'SIGNUP' | 'LINK';
  @Input({ required: true }) visible = false;
  @Input() username?: string;
  @Input() userId?: number;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() usernameChange = new EventEmitter<string>();
  @Output() closeEvent = new EventEmitter<User | undefined>()

  title?: string;

  form = new FormGroup({
    username: new FormControl<string | null>(null, [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private fdnetService: FdnetService
  ) { }

  ngOnInit() {
    if (this.mode === 'SIGNUP') {
      this.title = 'Create Account by FDNet';
    } else {
      this.title = 'Create only local Account';
    }
    if (this.mode === 'LINK' && this.username) {
      this.form.get('username')?.setValue(this.username);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === 'LINK' && !changes['username'] &&
      this.username &&
      this.username !== this.form.value.username) {
      this.usernameControl.patchValue(this.username);
    }
    if (this.mode === 'LINK' && changes['username']?.currentValue) {
      const val = changes['username'].currentValue;
      this.form.get('username')?.setValue(val);
    }
  }

  onHide() {
    this.onClose();
  }

  onSubmit() {
    if (this.mode === 'SIGNUP') {
      this.onSignup();
    } else {
      this.onLink();
    }
  }

  onLink() {
    if (this.form.value.username === this.username) {
      this.onClose();
      return;
    }
    if (this.form.valid && this.userId) {
      const username = this.form.value.username!;
      const userId = +this.userId;
      this.linkAuthUser(userId, username);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onSignup() {
    if (this.form.valid) {
      const username = this.form.value.username!;
      this.fdnetService.signup(username).subscribe({
        next: ({user, authUser}) => {
          console.log('FDNet user linked successfully:', authUser);
          this.username = username;
          this.form.reset();
          this.onClose(user)
        },
        error: (err) => {
          console.error('Error updating user:', err);
          if (err.status === 400) {
            this.form.get('username')?.setErrors({ username: err.error.message });
          }
        },
      })
    }
  }

  private linkAuthUser(userId: number, username: string) {
    this.fdnetService.getUser(username).pipe(
      switchMap(() => this.userService.putAuthUser(userId, username))
    ).subscribe({
      next: (user) => {
        console.log('FDNet user linked successfully:', user.username);
        this.username = username;
        this.form.reset();
        this.onClose()
      },
      error: (err) => {
        console.error('Error updating user:', err);
        if (err.status === 400) {
          this.form.get('username')?.setErrors({ username: err.error.message });
        }
      }
    });
  }

  private onClose(user?: User) {
    this.usernameChange.emit(this.username);
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closeEvent.emit(user);
  }

  get usernameControl() { return this.form.controls['username']; }
}
