import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TeamService } from 'src/app/services/team.service';

@Component({
    templateUrl: './team.component.html',
    providers: [MessageService, ConfirmationService]
})
export class TeamComponent implements OnInit {
    // Table configuration
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    // Data
    teams: Team[] = [];
    team?: Team;
    teamDialog = false;
    deleteTeamDialog = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private teamService: TeamService,
    ) { }

    ngOnInit() {
        // Fetch list of teams
        this.teamService.listTeams().subscribe({
            next: (v) => {
                this.teams = v;
                console.log(v);
            }
        });

        // Define columns for the table
        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'key', header: 'Key' },
            { field: 'description', header: 'Description' },
            { field: 'leaderId', header: 'Lead' },
            { field: 'members', header: 'Members' },
            { field: 'projectActive', header: 'PROJECT ACTIVE' },
            // { field: 'createdAt', header: 'Created At' },
            // { field: 'updatedAt', header: 'Updated At' },
        ];
    }

    editTeam(team: Team) {
        this.team = { ...team };
        console.log('Edit:', team);
        this.teamDialog = true;
    }

    createTeam() {
        this.team = undefined;
        this.teamDialog = true;
    }

    deleteTeam(team: Team) {
        this.deleteTeamDialog = true;
        this.team = { ...team };
    }

    confirmDelete() {
        if (!this.team) {
            this.deleteTeamDialog = false;
            return;
        }

        this.teamService.deleteTeam(this.team.id!).subscribe({
            next: () => {
                this.teams = this.teams.filter(t => t.id !== this.team!.id);
                this.deleteTeamDialog = false;
                this.team = undefined;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Deleted', life: 3000 });
            }
        });
    }

    hideDialog(event: any) {
        this.teamDialog = false;
        if (event && this.team?.id) {
            // Edited team
            this.teams[this.teams.findIndex(t => t.id === this.team!.id)] = event;
        } else if (event) {
            // Created new team
            this.teams.push(event);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Created', life: 3000 });
        }
        this.team = undefined;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}