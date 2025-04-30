
import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileSelectEvent } from 'primeng/fileupload';
import { map, Observable, of, switchMap, catchError, forkJoin } from 'rxjs';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { FileService } from 'src/app/services/file.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnInit {
  @Output() teamChange = new EventEmitter<Team>();
  @Output() closeEvent = new EventEmitter<Team | null>();
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  imagePreview?: string;
  coverFile?: File;
  isSubmitted = false;
  loading = false;

  teamForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    leader: new FormControl<User | null>(null, [Validators.required]),
    members: new FormControl<User[]>([], [Validators.required]),
  });

  constructor(
    private teamService: TeamService,
    private fileService: FileService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.teamForm.reset();
    this.imagePreview = undefined;
    this.coverFile = undefined;
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
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    const body: Partial<Team> = {
      name: this.teamForm.value.name!,
      leaderId: this.teamForm.value.leader?.id,
      // Don't include members in the update payload as they're handled separately
    };

    this.isSubmitted = true;
    this.loading = true;

    this.createTeam(body).pipe(
      switchMap(team => this.uploadImage(team)),
      switchMap(team => this.addMembers(team))
    ).subscribe({
      next: this.handleSuccess.bind(this),
      error: (e) => {
        this.isSubmitted = false;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: e.error?.error || 'Error',
          detail: e.error?.message || 'Failed to create team',
        });
      }
    });
  }

  private addMembers(team: Team): Observable<Team> {
    const currentMembers = this.teamForm.value.members || [];
    if (!team.id || !currentMembers.length) return of(team);

    const addRequests = currentMembers.map(member =>
      this.teamService.addMemberToTeam(team.id!, member.id!).pipe(
        catchError(error => {
          console.warn(`Failed to add member ${member.username || member.id}:`, error);
          return of(null);
        })
      )
    );

    return forkJoin(addRequests).pipe(
      map(() => ({ ...team, members: currentMembers }))
    );
  }

  private handleSuccess(team: Team) {
    this.isSubmitted = false;
    this.loading = false;
    this.closeEvent.emit(team);
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.closeEvent.emit(null);
    this.resetForm();
  }

  onHide() {
    if (!this.isSubmitted) {
      this.closeEvent.emit(null);
    }
    this.visible = false;
    this.visibleChange.emit(false);
    this.isSubmitted = false;
    this.resetForm();
  }

  get formControls() {
    return this.teamForm.controls;
  }

  private uploadImage(team: Team): Observable<Team> {
    if (!this.coverFile || !team.id) return of(team);
    
    const filepath = `/teams/${team.id}/`;
    const filename = 'cover.png';
    
    return this.fileService.upload(this.coverFile, filepath, filename).pipe(
      switchMap(res => 
        this.teamService.updateTeam(team.id!, { imageUrl: res.url }).pipe(
          map(() => ({ ...team, imageUrl: res.url }))
        )
      ),
      catchError(err => {
        console.error('Failed to upload image:', err);
        return of(team);
      })
    );
  }

  private createTeam(body: Partial<Team>): Observable<Team> {
    return this.teamService.createTeam(body);
  }
}
