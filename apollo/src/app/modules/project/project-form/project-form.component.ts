import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnChanges, OnInit {
  @Input() project?: Project;
  @Output() projectChange = new EventEmitter<Project>();

  @Output() onCloseEvent = new EventEmitter<Project | null>()

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  isPatch = false;
  isSubmited = false;

  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    key: new FormControl('', [Validators.maxLength(4), Validators.minLength(4)]),
    status: new FormControl('', [Validators.required]),
    leader: new FormControl(),
  })

  statuses = [
    { label: 'TODO', value: 'TODO' },
    { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
    { label: 'DONE', value: 'DONE' },
  ]

  users: Partial<User>[] = [];
  filteredUsers: Partial<User>[] = []
  constructor(private projectService: ProjectService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.listUser().subscribe({
      next: (v) => {
        this.users = v;
      }
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']?.currentValue) {
      this.isPatch = true;
      this.projectForm.patchValue(changes['project'].currentValue);
      this.projectForm.controls.key.disable()
    } else {
      this.isPatch = false;
      this.projectForm.controls.key.enable()
    }
  }

  showSelectedOption(selected: any) {
    console.log('Selected:', selected)
    return 0;
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

  onSave() {
    // Mapping only use fields
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    console.log(this.projectForm.value);
    const body: Partial<Project> | any = {
      name: this.projectForm.value.name!,
      key: this.projectForm.value.key!.toUpperCase(),
      description: this.projectForm.value.description!,
      status: this.projectForm.value.status!,
      ownerId: this.projectForm.value.leader?.id! || undefined,
    };
    this.isSubmited = true;
    console.log('body:', body);
    if (this.isPatch && this.project) {
      this.projectService.patch(this.project!.id!, body).subscribe({
        next: (v: any) => {
          console.log('patched', v)
          const updatedProject = {
            ...this.project,
            ...body,
          } as Project
          this.onCloseEvent.emit(updatedProject)
          this.visible = false;
        }
      })
    } else {
      this.projectService.create(body).subscribe({
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
    this.projectForm.reset();
  }

  get name() { return this.projectForm.get('name'); }
  get key() { return this.projectForm.get('key'); }
  get description() { return this.projectForm.get('description'); }
  get leader() { return this.projectForm.get('leader'); }
  get status() { return this.projectForm.get('status'); }
}
