import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-user-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserInputComponent),
      multi: true,
    },
  ],
})
export class UserInputComponent implements ControlValueAccessor {
  @Input() fontIcon = 'home';
  @Input() labelId = 'none';
  @Input() placeholder = 'none';
  @Input() defaultValue = '';

  public formControl: FormControl = new FormControl();

  writeValue(obj: any): void {
    this.formControl.setValue(obj);
  }
  registerOnChange(fn: any): void {
    this.formControl.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.formControl.valueChanges.subscribe(fn);
  }

  @Output() isDisabled = new EventEmitter<boolean>();

  changeDisabledState() {
    this.isDisabled.emit(false);
  }
}
