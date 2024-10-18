import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class UserInputComponent {
  @Input() fontIcon = 'home';
  @Input() labelId = 'none';
  @Input() placeholder = 'none';

  @Output() isDisabled = new EventEmitter<boolean>();

  changeDisabledState() {
    this.isDisabled.emit(false);
  }
}
