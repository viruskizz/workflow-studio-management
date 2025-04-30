import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
})
export class TeamTableComponent {
  @Input() teams: Team[] = [];
  @Input() loading = false;
  
  @Output() newTeam = new EventEmitter<void>();
  @Output() editTeam = new EventEmitter<Team>();
  @Output() deleteTeam = new EventEmitter<Team>();

  constructor(private confirmationService: ConfirmationService) {}

  onNew() {
    this.newTeam.emit();
  }

  onEdit(team: Team) {
    this.editTeam.emit(team);
  }

  onDelete(team: Team) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${team.name}?`,
      header: 'Confirm Team Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteTeam.emit(team);
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getImage(url: string) {
    return url || 'assets/images/noimage.jpg';
  }

  onImageError(team: Team) {
    if (team) {
      team.imageUrl = 'assets/images/noimage.jpg';
    }
  }
}
