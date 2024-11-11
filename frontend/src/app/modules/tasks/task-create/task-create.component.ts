import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css',
})
export class TaskCreateComponent {
  progressLists = [
    { name: 'Not Started', value: 0 },
    { name: 'In Progress', value: 1 },
    { name: 'Completed', value: 2 },
  ];

  assigneesLists = [
    { name: 'John Doe', value: 0 },
    { name: 'Jane Doe', value: 1 },
    { name: 'John Smith', value: 2 },
    { name: 'Jane Smith', value: 3 },
  ];

  taskFlowLists = [
    { name: 'Setup Scene', value: 0 },
    { name: 'Animate', value: 1 },
    { name: 'Crownd', value: 2 },
    { name: 'Dynamic', value: 3 },
    { name: '3D', value: 4 },
  ];

  parentTaskLists = [
    { name: 'Task 1', value: 0 },
    { name: 'Task 2', value: 1 },
    { name: 'Task 3', value: 2 },
    { name: 'Task 4', value: 3 },
    { name: 'Task 5', value: 4 },
  ];

  date = new FormControl(new Date());
  selectedProgress = { name: 'Not Started', value: 0 };
  selectedAssignees = new FormControl();
  selectedTaskFlows = new FormControl();
  selectedTaskList = new FormControl();

  // imgUrl: string = 'assets/images/image-default.jpg';
  // file: File | null = null; // Variable to store file
  // taskForm = new FormGroup({
  //   summary: new FormControl('', [Validators.required]),
  //   description: new FormControl(''),
  //   assignee: new FormControl(''),
  //   dueDate: new FormControl('')
  // })
  // constructor() {}

  // onChangeFile(event: any) {
  //   const file: File = event.target.files[0];
  //   console.log(event.target.files)
  //   if (file) {
  //     this.file = file
  //     // Convert to base64 for preview
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.imgUrl = e.target.result;
  //     };
  //     reader.readAsDataURL(this.file);
  //   }
  // }

  // onSubmit() {
  //   console.log(this.taskForm)
  // }
}
