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
import { finalize } from 'rxjs/operators';

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

    ngOnChanges(changes: SimpleChanges) {
        if (changes['team']?.currentValue) {
            const team = changes['team'].currentValue;
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

    onSave() {
        this.isSubmitted = true;
        if (this.teamForm.invalid) return;

        const formValue = this.teamForm.value;
        const teamData: Partial<Team> = {
            name: formValue.name,
            members: formValue.members,
            imageUrl: formValue.imageUrl,
            leaderId: formValue.leader?.id,
        };

        this.loading = true;
        const action = this.team?.id
            ? this.teamService.updateTeam(this.team.id, teamData)
            : this.teamService.createTeam(teamData as Team);

        action.pipe(finalize(() => (this.loading = false))).subscribe({
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
}
