import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent implements OnInit {
  createProjectForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      key: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      projectLead: ['', Validators.required],
      assigneeTeam: ['', Validators.required],
    });
  }

  onSubmit(modal: HTMLDialogElement): void {
    if (this.createProjectForm.valid) {
      console.log('Form data:', this.createProjectForm.value);
      // Automatically close the modal after successful form submission
      modal.close();
    }
  }
}
