import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnChanges, OnInit {
  @Input() team?: Team;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() teamChange = new EventEmitter<Team>();

  teamForm: FormGroup;
  isSubmitted = false;
  users: User[] = [];
  loading = false;

  imagePreview?: string;
  coverFile?: File;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private messageService: MessageService,
    private fileService: FileService
  ) {
    this.teamForm = this.createForm();
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['team']?.currentValue) {
      this.updateForm(changes['team'].currentValue);
    } else {
      this.resetForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      leader: [null, [Validators.required]],
      members: [[], [Validators.required]]
    });
  }

  private updateForm(team: Team): void {
   this.teamForm.patchValue({
      name: team.name,
      leader: this.users.find((u) => u.id === team.leaderId),
      members: team.members || [],
    });
  }

  private resetForm(): void {
    this.teamForm.reset();
    this.imagePreview = undefined;
  }

  loadUsers() {
    this.userService.listUser().subscribe({
      next: (users) => (this.users = users),
      error: (error) => console.error('Error loading users:', error),
    });
  }

  onSelectImage(event: FileSelectEvent) {
    const file = event.currentFiles[0];
    if (file) {
      this.coverFile = file;
      this.readFile(file);
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => (this.imagePreview = e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onSave() {
    this.isSubmitted = true;
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    const teamData = this.prepareTeamData();
    this.saveTeam(teamData);
  }

  private prepareTeamData(): Partial<Team> {
    const formValue = this.teamForm.value;
    return {
      name: formValue.name,
      members: formValue.members,
      leaderId: formValue.leader?.id
    };
  }

  private saveTeam(teamData: Partial<Team>): void {
    this.loading = true;
    
    // First handle the team save operation
    const saveObservable = this.team?.id
      ? this.teamService.updateTeam(this.team.id, teamData)
      : this.teamService.createTeam(teamData as Team);

    saveObservable.pipe(
      switchMap(savedTeam => {
        // After team is saved, upload the image if there is one
        if (this.coverFile) {
          const filepath = `/teams/${savedTeam.id}/`;
          const filename = 'cover.png';
          return this.fileService.upload(this.coverFile, filepath, filename).pipe(
            switchMap(fileResponse => {
              // Update team with image URL
              return this.teamService.updateTeam(savedTeam.id!, { imageUrl: fileResponse.url }).pipe(
                switchMap(() => of(savedTeam))
              );
            })
          );
        }
        return of(savedTeam);
      })
    ).subscribe({
      next: this.handleSaveSuccess.bind(this),
      error: this.handleSaveError.bind(this),
      complete: () => (this.loading = false)
    });
  }

  private handleSaveSuccess(updatedTeam: Team): void {
    // If we're creating a new team and have members to add
    if (!this.team?.id && updatedTeam.id && this.teamForm.value.members?.length > 0) {
      // Add members to the newly created team
      this.addMembersToTeam(updatedTeam.id, this.teamForm.value.members)
        .subscribe({
          next: () => {
            // Get the updated team with members
            this.teamService.getTeamWithMembers(updatedTeam.id!)
              .subscribe(teamWithMembers => {
                this.teamChange.emit(teamWithMembers);
                this.showSuccessMessage();
                this.closeDialog();
              });
          },
          error: (error) => {
            console.error('Error adding members to team:', error);
            // Still emit the team even if adding members failed
            this.teamChange.emit(updatedTeam);
            this.showSuccessMessage();
            this.closeDialog();
          }
        });
    } else {
      // For updates or teams without members, just emit the team
      this.teamChange.emit(updatedTeam);
      this.showSuccessMessage();
      this.closeDialog();
    }
  }

  private showSuccessMessage(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Team ${this.team?.id ? 'updated' : 'created'} successfully.`,
      life: 3000,
    });
  }

  private handleSaveError(error: Error): void {
    console.error('Error saving team:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save team.',
      life: 3000,
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
    this.isSubmitted = false;
  }

  get formControls() {
    return this.teamForm.controls;
  }

  removeMember(member: User) {
    const currentMembers = this.teamForm.get('members')?.value as User[];
    const updatedMembers = currentMembers.filter(m => m.id !== undefined && m.id !== member.id);
    this.teamForm.patchValue({ members: updatedMembers });
  }

  private addMembersToTeam(teamId: number, members: User[]): Observable<unknown[]|null> {
    if (!members || members.length === 0) {
      return of(null);
    }
    
    // Create an array of observables for each member addition
    const addMemberRequests = members.map(member => 
      this.teamService.addMemberToTeam(teamId, member.id!)
    );
    
    // Execute all requests in parallel
    return forkJoin(addMemberRequests);
  }
}

