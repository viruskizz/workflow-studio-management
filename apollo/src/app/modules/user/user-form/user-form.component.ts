import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnChanges {
  @Input() user?: User;
  @Output() userChange = new EventEmitter<User>();

  @Output() onCloseEvent = new EventEmitter<User | null>()

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  isPatch = false;
  isSubmited = false;

  userForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.email]),
    role: new FormControl('', Validators.required),
  })

  roles = [
    { label: 'Member', value: 'MEMBER' },
    { label: 'Moderator', value: 'Moderator' },
    { label: 'Admin', value: 'Admin' },
  ]

  constructor(private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']?.currentValue) {
      this.isPatch = true;
      this.userForm.patchValue(changes['user'].currentValue);
      this.userForm.controls.username.disable()
    } else {
      this.isPatch = false;
      this.userForm.controls.password.addValidators([Validators.required, Validators.minLength(6)])
      this.userForm.controls.username.enable()
    }
  }

  onSave() {
    // Mapping only use fields
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const body: Partial<User> = {
      firstName: this.userForm.value.firstName!,
      lastName: this.userForm.value.lastName!,
      username: this.userForm.value.username!,
      email: this.userForm.value.email!,
      // role: this.userForm.value.role || undefined,
    };
    this.isSubmited = true;
    if (this.isPatch && this.user) {
      this.userService.patchUser(this.user.id!, body).subscribe({
        next: (v: any) => {
          const updatedUser = {
            ...this.user,
            ...body,
            username: this.user?.username || undefined,
          } as User
          this.onCloseEvent.emit(updatedUser)
          this.visible = false;
        }
      })
    } else {
      body.password = this.userForm.value.password || undefined;
      this.userService.createUser(body).subscribe({
        next: (v) => {
          console.log('Created', v);
          this.onCloseEvent.emit(v);
          // this.visible = false;
        }
      })
    }
  }

  onCancel() {
    this.visible = false;
  }

  onHide() {
    if (!this.isSubmited) {
      this.onCloseEvent.emit(null)
    }
    // Reset Everything
    this.visible = false;
    this.isSubmited = false;
    this.userForm.reset();
  }

  get username() { return this.userForm.get('username'); }
  get password() { return this.userForm.get('password'); }
  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get role() { return this.userForm.get('role'); }
  get email() { return this.userForm.get('email'); }
}
