import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent {
  imgUrl: string = 'assets/images/image-default.jpg';
  file: File | null = null; // Variable to store file
  taskForm = new FormGroup({
    summary: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    assignee: new FormControl(''),
    dueDate: new FormControl('')
  })
  constructor() {}

  onChangeFile(event: any) {
    const file: File = event.target.files[0];
    console.log(event.target.files)
    if (file) {
      this.file = file
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgUrl = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  onSubmit() {
    console.log(this.taskForm)
  }
}
