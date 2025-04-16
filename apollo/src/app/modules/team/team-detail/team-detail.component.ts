import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Team } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { FileService } from 'src/app/services/file.service';
import { finalize, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-team-detail',
    templateUrl: './team-detail.component.html',
})
export class TeamDetailComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload!: FileUpload;

    teamId!: number;
    team!: Team;
    teamForm: FormGroup;
    isSubmitted = false;
    loading = false;
    users: User[] = [];
    imagePreview?: string;
    coverFile?: File;
    searchText = '';
    filteredMembers: User[] = [];
    availableUsers: User[] = [];
    filteredAvailableUsers: User[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private teamService: TeamService,
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fileService: FileService
    ) {
        this.teamForm = this.createForm();
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.teamId = +params['id'];
            this.loadTeamDetails();
        });
        this.loadUsers();

        this.teamForm.valueChanges.subscribe(() => {
            this.filteredMembers = this.formControls['members'].value || [];
        });
        this.teamForm.addControl('newMember', new FormControl(null));
    }

    private createForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            leader: [null, [Validators.required]],
            members: [[], [Validators.required]],
            imageUrl: [''],
        });
    }

    loadTeamDetails() {
        this.loading = true;
        this.teamService
            .getTeamWithMembers(this.teamId)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (team) => {
                    this.team = team;
                    this.updateForm(team);
                },
                error: (error) => {
                    console.error('Error loading team details:', error);
                    this.showMessage(
                        'error',
                        'Error',
                        'Failed to load team details'
                    );
                },
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
        this.updateAvailableUsers();
    }

    loadUsers() {
        this.userService.listUser().subscribe({
            next: (users) => {
                this.users = users;
                this.updateAvailableUsers();
            },
            error: (error) => console.error('Error loading users:', error),
        });
    }

    updateAvailableUsers() {
        const currentMemberIds = new Set(
            (this.formControls['members'].value || []).map((m: User) => m.id)
        );
        this.availableUsers = this.users.filter(
            (user) => !currentMemberIds.has(user.id)
        );
        this.filterAvailableUsers();
    }

    filterAvailableUsers() {
        if (!this.searchText.trim()) {
            this.filteredAvailableUsers = this.availableUsers;
            return;
        }

        const searchLower = this.searchText.toLowerCase().trim();
        this.filteredAvailableUsers = this.availableUsers.filter(
            (user) =>
                user.username?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower) ||
                user.firstName?.toLowerCase().includes(searchLower) ||
                user.lastName?.toLowerCase().includes(searchLower)
        );
    }

    onSelectImage(event: FileSelectEvent) {
        const file = event.currentFiles[0];
        if (file) {
            this.coverFile = file;
            this.readFile(file);
            this.uploadImage(file);
        }
    }

    private readFile(file: File): void {
        const reader = new FileReader();
        reader.onload = (e) => (this.imagePreview = e.target?.result as string);
        reader.readAsDataURL(file);
    }

    private uploadImage(file: File): void {
        if (!this.teamId) return;

        this.loading = true;
        const filepath = `/teams/${this.teamId}/`;
        const filename = 'cover.png';

        this.fileService
            .upload(file, filepath, filename)
            .pipe(
                switchMap((res) =>
                    this.teamService.updateTeam(this.teamId, {
                        imageUrl: res.url,
                    })
                ),
                finalize(() => {
                    this.loading = false;
                    if (this.fileUpload) this.fileUpload.clear();
                })
            )
            .subscribe({
                next: (updatedTeam) => {
                    this.team = updatedTeam;
                    this.imagePreview = updatedTeam.imageUrl;
                    this.teamForm.patchValue({
                        imageUrl: updatedTeam.imageUrl,
                    });
                    this.showMessage(
                        'success',
                        'Success',
                        'Team image updated successfully'
                    );
                },
                error: (error) => {
                    console.error('Error uploading image:', error);
                    this.showMessage(
                        'error',
                        'Error',
                        'Failed to upload image'
                    );
                },
            });
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
        this.teamService
            .updateTeam(this.teamId, teamData)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (updatedTeam) => {
                    this.team = updatedTeam;
                    this.showMessage(
                        'success',
                        'Success',
                        'Team updated successfully'
                    );
                },
                error: (error) => {
                    console.error('Error saving team:', error);
                    this.showMessage(
                        'error',
                        'Error',
                        'Failed to save team details'
                    );
                },
            });
    }

    private showMessage(
        severity: string,
        summary: string,
        detail: string,
        life = 3000
    ) {
        this.messageService.add({ severity, summary, detail, life });
    }

    get formControls() {
        return this.teamForm.controls;
    }

    getImage(url: string | undefined) {
        return url || 'assets/images/noimage.jpg';
    }

    removeMember(member: User) {
        const currentMembers = this.formControls['members'].value || [];
        const updatedMembers = currentMembers.filter(
            (m: User) => m.id !== member.id
        );
        this.formControls['members'].setValue(updatedMembers);
        this.updateAvailableUsers();
    }

    addMember(user: User) {
        const currentMembers = this.formControls['members'].value || [];
        if (!currentMembers.some((m: User) => m.id === user.id)) {
            const updatedMembers = [...currentMembers, user];
            this.formControls['members'].setValue(updatedMembers);
            this.updateAvailableUsers();
        }
    }

    deleteTeam() {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${this.team.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.performTeamDeletion(this.team),
        });
    }

    performTeamDeletion(team: Team) {
        this.loading = true;

        // First check if team has members
        if (team.members && team.members.length > 0) {
            // Create an array of observables for removing each member
            const removeMemberRequests = team.members.map(member =>
                this.teamService.removeMemberFromTeam(team.id!, member.id!)
            );

            // Execute all member removal requests, then delete the team
            forkJoin(removeMemberRequests)
                .pipe(
                    switchMap(() => this.teamService.deleteTeam(team.id!)),
                    finalize(() => this.loading = false)
                )
                .subscribe({
                    next: () => {
                        this.showMessage('success', 'Success', 'Team deleted successfully');
                        this.router.navigate(['/teams']);
                    },
                    error: (error) => {
                        console.error('Error deleting team:', error);
                        this.showMessage('error', 'Error', 'Failed to delete team');
                    }
                });
        } else {
            // If no members, directly delete the team
            this.teamService.deleteTeam(team.id!)
                .pipe(finalize(() => this.loading = false))
                .subscribe({
                    next: () => {
                        this.showMessage('success', 'Success', 'Team deleted successfully');
                        this.router.navigate(['/teams']);
                    },
                    error: (error) => {
                        console.error('Error deleting team:', error);
                        this.showMessage('error', 'Error', 'Failed to delete team');
                    }
                });
        }
    }

    triggerFileUpload() {
        if (this.fileUpload?.advancedFileInput) {
            this.fileUpload.advancedFileInput.nativeElement.click();
        }
    }

    addSelectedMember() {
        const newMember = this.formControls['newMember'].value;
        if (newMember && newMember.id && this.teamId) {
            const currentMembers = this.formControls['members'].value || [];

            // Check if member is already in the team
            if (!currentMembers.some((m: User) => m.id === newMember.id)) {
                this.loading = true;
                this.teamService.addMemberToTeam(this.teamId, newMember.id)
                    .pipe(finalize(() => this.loading = false))
                    .subscribe({
                        next: () => {
                            const updatedMembers = [...currentMembers, newMember];
                            this.formControls['members'].setValue(updatedMembers);

                            // Reset the selection
                            this.formControls['newMember'].setValue(null);

                            // Update filtered members and available users
                            this.filteredMembers = updatedMembers;
                            this.updateAvailableUsers();

                            this.showMessage('success', 'Success', 'Member added successfully');
                        },
                        error: (error) => {
                            console.error('Error adding member:', error);
                            this.showMessage('error', 'Error', 'Failed to add member to team');
                        }
                    });
            } else {
                // Optional: Show message that user is already a member
                this.messageService.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'This user is already a team member',
                });
            }
        }
    }

    onImageError() {
        this.imagePreview = 'assets/images/noimage.jpg';
        if (this.team) {
            this.team.imageUrl = 'assets/images/noimage.jpg';
        }
    }
}
