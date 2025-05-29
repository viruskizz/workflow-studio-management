import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-team-dropdown',
  templateUrl: './team-dropdown.component.html',
})
export class TeamDropdownComponent implements OnInit {
  options: Partial<Team>[] = []
  selectedTeam: Team | undefined;

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input() isShowLabel = true
  @Input() labelFor = 'Team'
  loading = false

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.loading = true;
    this.teamService.listTeams().subscribe({
      next: (teams) => {
        this.options = teams;
        this.loading = false
      }
    })
  }

  onImageError(event: Event, idx: number) {
    this.options[idx] = {
      ...this.options[idx],
      imageUrl: getDefaultAvatar()
    }
  }

  onSelect(event: any) {
    this.form.controls[this.controlName].patchValue(event.value)
  }
}
