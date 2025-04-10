import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-team-autocomplete',
  templateUrl: './team-autocomplete.component.html',
})
export class TeamAutocompleteComponent {
  options: Partial<Team>[] = []
  selectedTeam: Team | undefined;

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input() isShowLabel: boolean = true
  @Input() labelFor = 'Team'

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.listTeams().subscribe({
      next: (teams) => {
        // console.log(teams)
        this.options = teams;
      }
    })
  }

  onImageError(event: Event, idx: number) {
    this.options[idx] = {
      ...this.options[idx],
      imageUrl: getDefaultAvatar()
    }
  }

  onSelect(event: AutoCompleteSelectEvent) {
    this.form.controls[this.controlName].patchValue(event.value)
  }
}
