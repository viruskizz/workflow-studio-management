import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-project-create-dialog',
  templateUrl: './project-create-dialog.component.html',
  styleUrl: './project-create-dialog.component.css'
})
export class ProjectCreateDialogComponent {
  matcher = new MyErrorStateMatcher();
  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  })
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}