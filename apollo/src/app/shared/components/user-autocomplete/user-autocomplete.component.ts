import { filter } from 'rxjs';
import { AfterViewInit, Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-user-autocomplete',
  templateUrl: './user-autocomplete.component.html',
})
export class UserAutocompleteComponent implements OnInit {
  users: Partial<User>[] = []
  filteredUsers: Partial<User>[] = []

  @Input({ required: true }) form: FormGroup = new FormGroup({});
  @Input({ required: true }) controlName: string = 'user';
  @Input() labelFor = 'User'
  @Input() optionLabel = 'username'
  @Input() optionValue = 'id'
  @Input() multiple: boolean = false
  @Input() limit = 1;
  @Input() unique = true;
  @Input() dropdown: boolean = false

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
    this.filteredUsers[idx].imageUrl = getDefaultAvatar()
  }

  onUnselect(event: any) {
    console.log('onUnselect: ', event)
  }

  onSelect(event: AutoCompleteSelectEvent) {
    if (this.multiple) {
      let values = this.form.controls[this.controlName].value;
      if (this.unique) {
        values = [
          ...values.filter((user: Partial<User>) => user.id !== event.value.id),
          event.value
        ]
        this.form.controls[this.controlName].patchValue(values)
      }
      if (values.length > this.limit) {
        this.form.controls[this.controlName].patchValue(
          values.slice(1)
        )
      }
      
    }
  }
}
