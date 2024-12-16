import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-user-autocomplete',
  templateUrl: './user-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserAutocompleteComponent),
      multi: true,
    },
  ],
})
export class UserAutocompleteComponent implements ControlValueAccessor {
  users: Partial<User>[] = []
  filteredUsers: Partial<User>[] = []

  formControl = new FormControl()
  @Input() labelFor = 'User'
  @Input() optionLabel = 'username'
  @Input() optionValue = 'id'
  @Input() dropdown = true

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.listUser().subscribe({
      next: (v) => {
        this.users = v;
      }
    })
  }

  filterUsers(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const fields = ['username', 'firstName', 'lastName'];
    const filtered = this.users.slice().filter((user: any) => {
      const str = fields.reduce((prev, cur) => prev + user[cur], '');
      return str.toLowerCase().includes(query.toLowerCase());
    });
    this.filteredUsers = filtered;
  }

  onImageError(event: Event, idx: number) {
    console.log(idx);
    console.log(event);
    this.filteredUsers[idx].imageUrl = getDefaultAvatar()
  }

  onSelect(event: AutoCompleteSelectEvent) {
    this.formControl.patchValue(event.value);
  }

  writeValue(value: any): void {
    this.formControl.patchValue(value);
  }

  registerOnChange(fn: any): void {
    this.formControl.valueChanges.subscribe((val) => {
      console.log('Change:', val);
      fn(val)
    });
  }

  registerOnTouched(fn: any): void {
    this.formControl.valueChanges.subscribe(val => fn(val));
  }
}
