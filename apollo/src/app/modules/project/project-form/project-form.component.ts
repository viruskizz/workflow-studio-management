import { FileService } from './../../../services/file.service';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, UploadEvent } from 'primeng/fileupload';
import { EMPTY, map, Observable, of, switchMap, catchError } from 'rxjs';
import { FileResponse } from 'src/app/models/file.model';
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

  imagePreview?: string;
  coverFile?: File;

  isPatch = false;
  isSubmited = false;

  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    key: new FormControl('', [Validators.maxLength(4), Validators.minLength(4)]),
    status: new FormControl('TODO', [Validators.required]),
    leader: new FormControl(),
    imageUrl: new FormControl()
  })


  statuses = [
    { label: 'TODO', value: 'TODO' },
    { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
    { label: 'DONE', value: 'DONE' },
  ]

  users: Partial<User>[] = [];
  filteredUsers: Partial<User>[] = []
  constructor(
    private projectService: ProjectService,
    private fileService: FileService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']?.currentValue) {
      console.log('Project:', this.project)
      this.imagePreview = this.project?.imageUrl;
      this.isPatch = true;
      this.projectForm.patchValue({
        ...changes['project'].currentValue,
        leader: [changes['project'].currentValue.leader]
      });
      this.projectForm.controls.key.disable()
    } else {
      this.isPatch = false;
      this.projectForm.controls.key.enable()
    }
  }

  onSelectImage(event: FileSelectEvent) {
    const file = event.currentFiles[0];
    if (file) {
      this.coverFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.imagePreview = event.target?.result as string;
      }
    }
  }


  onSave() {
    // Mapping only use fields
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    // console.log('Submitted', this.projectForm.value);
    const body: Partial<Project> | any = {
      name: this.projectForm.value.name!,
      key: this.projectForm.getRawValue().key?.toUpperCase(),
      description: this.projectForm.value.description!,
      status: this.projectForm.value.status!,
      leaderId: this.projectForm.value.leader[0]?.id! || undefined,
    };
    this.isSubmited = true;
    // console.log('Body:', body);
    const saveObservable = this.isPatch && this.project ? this.toUpdate(body) : this.toCreate(body);
    saveObservable.pipe(
      switchMap(v => this.toUpload(v))
    ).subscribe({
      next: res => {
        // console.log('Saved:', res);
        this.isSubmited = false;
        this.onCloseEvent.emit(res)
        this.visible = false;
      },
      error: e => {
        console.log(e)
        this.messageService.add({
          severity: 'error',
          summary: e.error.error,
          detail: e.error.message.toString(),
        });
      }
    })
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

  private toUpload(updatedProject: Project) {
    if (this.project && this.coverFile) {
      const filepath = `/projects/${this.project.id}/`
      const filename = 'cover.png';
      return this.fileService.upload(this.coverFile, filepath, filename).pipe(
        switchMap(res => {
          return this.toUpdate({ imageUrl: res.url })
        })
      );
    }
    return of(updatedProject)
  }

  private toCreate(body: any): Observable<Project> {
    return this.projectService.create(body).pipe(
      map(res => {
        this.project = res;
        return res;
      })
    )
  }

  private toUpdate(body: any): Observable<Project> {
    body.key = undefined;
    return this.projectService.patch(this.project!.id!, body).pipe(
      map((v: any) => {
        this.project = {
          ...this.project,
          ...body,
          key: this.project!.key,
        } as Project
        return this.project
      })
    )
  }
}
