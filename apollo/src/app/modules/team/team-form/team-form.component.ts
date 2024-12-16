import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
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
  filteredLeaders: User[] = [];

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
      this.userService.listUser ().subscribe({
          next: (users) => {
              this.users = users;
              this.filteredLeaders = [...this.users];
          },
          error: (error) => console.error('Error loading users:', error),
      });
  }

  removeMember(member: User) {
      const currentMembers = this.teamForm.get('members')?.value || [];
      const updatedMembers = currentMembers.filter((m: User) => m.id !== member.id);
      this.teamForm.patchValue({ members: updatedMembers });
  }

  onSearchChange(searchText: string) {
      const searchTerm = searchText.toLowerCase();
      this.filteredLeaders = this.users.filter((user) =>
          user.username.toLowerCase().includes(searchTerm)
      );
  }

  selectLeader(leader: User) {
      this.teamForm.patchValue({ leaderId: leader.id });
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['team']?.currentValue) {
          const team = changes['team'].currentValue;
          this.teamForm.patchValue({
              name: team.name,
              leaderId: team.leaderId,
              members: team.members || [],
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

      const teamData: Partial<Team> = this.teamForm.value;

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