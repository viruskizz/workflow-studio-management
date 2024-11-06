import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.css',
})
export class TaskViewComponent {
  imgSrc = 'https://turbosmurfs.gg/storage/splash/Teemo_8.jpg';
  inputBoxWithIcon =
    'pl-10 bg-transparent focus:outline focus:outline-2 focus:outline-input-outline rounded-sm';

  inputBox =
    'pl-4 bg-transparent focus:outline focus:outline-2 focus:outline-input-outline rounded-sm';
  progressIcon = 'home';
  labelClass = 'flex items-center gap-4 text-gray-500';

  propertiesForm = new FormGroup({
    state: new FormControl(1),
    assignees: new FormControl('mok maard'),
    startDate: new FormControl(),
    taskFlow: new FormControl('animate'),
    parentTask: new FormControl(),
    subTask : new FormControl(),
    comment: new FormControl(),
  })

  states = [
    { value: 1, label: 'Open' },
    { value: 2, label: 'In Progress' },
    { value: 3, label: 'Completed' },
  ];

  submitHandler() {
    console.log(this.propertiesForm.value);
  }
}
