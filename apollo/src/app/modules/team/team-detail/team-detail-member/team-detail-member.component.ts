import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user.model';
import { TeamService } from 'src/app/services/team.service';
import { forkJoin, of } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-team-detail-member',
  templateUrl: './team-detail-member.component.html',
})
export class TeamDetailMemberComponent implements OnInit {
  @Input() teamId!: number;
  teamForm: FormGroup;
  isSubmitted = false;
  loading = false;
  filteredMembers: User[] = [];
  availableUsers: User[] = [];
  filteredAvailableUsers: User[] = [];
  searchText = '';
  membersToAdd: User[] = [];
  membersToRemove: User[] = [];
  roleOptions = [
    { label: 'Member', value: 'member' },
    { label: 'Admin', value: 'admin' }
  ];

  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() filteredMembersChange = new EventEmitter<User[]>();
  @Output() availableUsersChange = new EventEmitter<User[]>();
  @Output() filteredAvailableUsersChange = new EventEmitter<User[]>();

  constructor(
    private teamService: TeamService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.teamForm = this.fb.group({
      members: [[]],
      newMember: [null]
    });
  }

  ngOnInit() {
    if (!this.teamId) {
      this.route.parent?.params.subscribe(params => {
        this.teamId = +params['id'];
        this.loadMembers();
      });
    } else {
      this.loadMembers();
    }
    this.loadUsers();
  }

  loadMembers() {
    this.loading = true;
    this.teamService.getTeamWithMembers(this.teamId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (team) => {
          this.filteredMembers = team.members || [];
          this.formControls['members'].setValue(this.filteredMembers);
          this.updateAvailableUsers();
        },
        error: (error) => {
          console.error('Error loading team members:', error);
          this.showMessage('error', 'Error', 'Failed to load team members');
        },
      });
  }

  loadUsers() {
    this.userService.listUser().subscribe({
      next: (users) => {
        this.availableUsers = users;
        this.updateAvailableUsers();
      },
      error: (error) => console.error('Error loading users:', error),
    });
  }

  get formControls() { return this.teamForm.controls; }

  getImage(url: string | undefined) { return url || 'assets/images/noimage.jpg'; }

  removeMember(member: User) {
    if (!this.membersToRemove.some(m => m.id === member.id)) {
      this.membersToRemove.push(member);
    }
    this.filteredMembers = this.filteredMembers.filter(m => m.id !== member.id);
    this.formControls['members'].setValue(this.filteredMembers);
    this.updateAvailableUsers();
  }

  updateAvailableUsers() {
    const currentMemberIds = new Set(this.filteredMembers.map(m => m.id));
    this.availableUsers = this.availableUsers.filter(user => !currentMemberIds.has(user.id));
    this.availableUsersChange.emit(this.availableUsers);
    this.filterAvailableUsers();
  }

  filterAvailableUsers() {
    if (!this.searchText.trim()) {
      this.filteredAvailableUsers = this.availableUsers;
      this.filteredAvailableUsersChange.emit(this.filteredAvailableUsers);
      return;
    }

    const searchLower = this.searchText.toLowerCase().trim();
    this.filteredAvailableUsers = this.availableUsers.filter(user =>
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower)
    );
    this.filteredAvailableUsersChange.emit(this.filteredAvailableUsers);
  }

  addSelectedMember() {
    const newMembers = this.formControls['newMember'].value;
    if (!newMembers || (Array.isArray(newMembers) && newMembers.length === 0)) return;
    
    const membersToAdd = Array.isArray(newMembers) ? newMembers : [newMembers];
    const uniqueNewMembers = membersToAdd.filter(newMember => 
      newMember && newMember.id && !this.filteredMembers.some(m => m.id === newMember.id)
    );
    
    if (uniqueNewMembers.length === 0) {
      this.showMessage('info', 'Info', 'Selected users are already team members');
      return;
    }
    
    this.membersToAdd = [...this.membersToAdd, ...uniqueNewMembers];
    this.filteredMembers = [...this.filteredMembers, ...uniqueNewMembers];
    this.formControls['members'].setValue(this.filteredMembers);
    this.updateAvailableUsers();
    this.formControls['newMember'].setValue(null);
  }

  onSave() {
    if (this.membersToAdd.length === 0 && this.membersToRemove.length === 0) return;
    
    this.loading = true;
    this.loadingChange.emit(this.loading);
    
    const removeRequests = this.membersToRemove.map(member => 
      this.teamService.removeMemberFromTeam(this.teamId, member.id!)
        .pipe(catchError(error => {
          console.error(`Failed to remove member ${member.id}:`, error);
          return of(null);
        }))
    );
    
    const addRequests = this.membersToAdd.map(member => 
      this.teamService.addMemberToTeam(this.teamId, member.id!)
        .pipe(catchError(error => {
          console.error(`Failed to add member ${member.id}:`, error);
          return of(null);
        }))
    );
    
    forkJoin([...removeRequests, ...addRequests])
      .pipe(finalize(() => {
        this.loading = false;
        this.loadingChange.emit(this.loading);
      }))
      .subscribe({
        next: () => {
          this.membersToAdd = [];
          this.membersToRemove = [];
          this.loadMembers();
          this.showMessage('success', 'Success', 'Team members updated successfully');
        },
        error: (error) => {
          console.error('Error updating team members:', error);
          this.showMessage('error', 'Error', 'Failed to update team members');
        }
      });
  }

  private showMessage(severity: string, summary: string, detail: string, life = 3000) {
    this.messageService.add({ severity, summary, detail, life });
  }
}
