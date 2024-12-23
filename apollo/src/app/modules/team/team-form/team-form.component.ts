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
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      leader: [null, [Validators.required]],
      members: [[], [Validators.required]],
      imageUrl: [''],
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['team']?.currentValue) {
      const team = changes['team'].currentValue;
      this.imagePreview = team.imageUrl;
      this.teamForm.patchValue({
        name: team.name,
        leader: this.users.find((u) => u.id === team.leaderId),
        members: team.members || [],
        imageUrl: team.imageUrl || '',
      });
    } else {
      this.teamForm.reset();
    }
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.imagePreview = event.target?.result as string;
      };
    }
  }

  onSave() {
    this.isSubmitted = true;
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    const formValue = this.teamForm.value;
    const teamData: Partial<Team> = {
      name: formValue.name,
      members: formValue.members,
      imageUrl: formValue.imageUrl,
      leaderId: formValue.leader?.id,
    };

    this.loading = true;
    const saveObservable = this.team?.id
      ? this.teamService.updateTeam(this.team.id, teamData)
      : this.teamService.createTeam(teamData as Team);

    saveObservable.subscribe({
      next: (updatedTeam) => {
        this.teamChange.emit(updatedTeam);
        this.closeDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Team ${this.team?.id ? 'updated' : 'created'} successfully.`,
        });
      },
      error: (error) => {
        console.error('Error saving team:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save team.',
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.teamForm.reset();
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
