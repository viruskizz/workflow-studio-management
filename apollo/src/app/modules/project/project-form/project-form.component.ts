import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnChanges {
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
    leader: new FormControl(''),
  })

  statuses = [
    { label: 'TODO', value: 'TODO' },
    { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
    { label: 'DONE', value: 'DONE' },
  ]

  constructor(private projectService: ProjectService) { }

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

  onSave() {
    // Mapping only use fields
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    const body: Partial<Project> = {
      name: this.projectForm.value.name!,
      key: this.projectForm.value.key!,
      description: this.projectForm.value.description!,
      status: this.projectForm.value.status!,
      // role: this.projectForm.value.role || undefined,
    };
    this.isSubmited = true;
    if (this.isPatch && this.project) {
      this.projectService.patch(this.project.id!, body).subscribe({
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
