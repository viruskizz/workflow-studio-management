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
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

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
    filteredMembers: User[] = [];

    constructor(
        private fb: FormBuilder,
        private teamService: TeamService,
        private userService: UserService
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

    loadUsers() {
        this.userService.listUser().subscribe({
            next: (users) => {
                this.users = users;
                this.filteredLeaders = [...this.users];
                this.filteredMembers = [...this.users];
            },
            error: (error) => console.error('Error loading users:', error),
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['team']?.currentValue) {
            const team = changes['team'].currentValue;
            this.teamForm.patchValue({
                name: team.name,
                leader: team.leader,
                members: team.members || [],
                imageUrl: team.imageUrl || '',
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
    
        const formValue = this.teamForm.value;
        const teamData: Partial<Team> = {
          name: formValue.name,
          members: formValue.members,
          imageUrl: formValue.imageUrl,
          leaderId: formValue.leader?.id ? Number(formValue.leader.id) : undefined
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

    onUpload(event: any) {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.teamForm.patchValue({
                    imageUrl: reader.result as string,
                });
            };
        }
    }

    filterLeaders(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredLeaders = this.users.filter(
            (user) =>
                user.username.toLowerCase().includes(query) ||
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query)
        );
    }

    filterMembers(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredMembers = this.users.filter(
            (user) =>
                user.username.toLowerCase().includes(query) ||
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query)
        );
    }

    onMemberSelect(event: any) {
        const selectedMember = event.value;
        const currentMembers = this.teamForm.get('members')?.value || [];
        if (
            !currentMembers.some(
                (member: User) => member.id === selectedMember.id
            )
        ) {
            this.teamForm.patchValue({
                members: [...currentMembers, selectedMember],
            });
        }
    }

    removeMember(member: User) {
        const currentMembers = this.teamForm.get('members')?.value || [];
        const updatedMembers = currentMembers.filter(
            (m: User) => m.id !== member.id
        );
        this.teamForm.patchValue({ members: updatedMembers });
    }
}
