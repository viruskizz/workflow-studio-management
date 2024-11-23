import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

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
  filteredUsers: User[] = [];

  get selectedLeader(): User | undefined {
    const leaderId = this.teamForm.get('leaderId')?.value;
    return this.users.find(user => user.id === leaderId);
  }

  constructor(
    private fb: FormBuilder, 
    private teamService: TeamService,
    private userService: UserService
  ) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      leaderId: [null, [Validators.required]],
      members: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.listUser().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  getUser(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['team']?.currentValue) {
      this.teamForm.patchValue({
        ...changes['team'].currentValue,
        members: changes['team'].currentValue.members,
      });
    } else {
      this.teamForm.reset();
    }
  }

  onSave() {
    this.isSubmitted = true;
    if (this.teamForm.invalid) {
      return;
    }

    const formData = this.teamForm.value;
    const teamData: Partial<Team> = {
      name: formData.name,
      leaderId: formData.leaderId,
      members: formData.members,
    };

    const action = this.team?.id
      ? this.teamService.updateTeam(this.team.id, teamData)
      : this.teamService.createTeam(teamData as Team);

    action.subscribe({
      next: (updatedTeam) => {
        this.teamChange.emit(updatedTeam);
        this.closeDialog();
      },
      error: (error) => console.error('Error saving team:', error),
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
}

