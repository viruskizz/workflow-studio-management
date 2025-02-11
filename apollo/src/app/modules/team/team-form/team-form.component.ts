import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
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
      members: [[], [Validators.required]],
      imageUrl: [''],
    });
  }

  private updateForm(team: Team): void {
    this.imagePreview = team.imageUrl;
    this.teamForm.patchValue({
      name: team.name,
      leader: this.users.find((u) => u.id === team.leaderId),
      members: team.members || [],
      imageUrl: team.imageUrl || '',
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
      imageUrl: formValue.imageUrl,
      leaderId: formValue.leader?.id,
    };
  }

  private saveTeam(teamData: Partial<Team>): void {
    this.loading = true;
    const saveObservable = this.team?.id
      ? this.teamService.updateTeam(this.team.id, teamData)
      : this.teamService.createTeam(teamData as Team);

    saveObservable.subscribe({
      next: this.handleSaveSuccess.bind(this),
      error: this.handleSaveError.bind(this),
      complete: () => (this.loading = false)
    });
  }

  private handleSaveSuccess(updatedTeam: Team): void {
    this.teamChange.emit(updatedTeam);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Team ${this.team?.id ? 'updated' : 'created'} successfully.`,
      life: 3000,
    });
    this.closeDialog();
  }

  private handleSaveError(error: any): void {
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
}

