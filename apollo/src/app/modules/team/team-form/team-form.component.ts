import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnChanges {
  @Input() team?: Team;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() teamChange = new EventEmitter<Team>();

  teamForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder, private teamService: TeamService) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      leaderId: ['', [Validators.required]],
      members: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['team']?.currentValue) {
      this.teamForm.patchValue({
        ...changes['team'].currentValue,
        members: changes['team'].currentValue.members?.join(', '),
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

    console.log('Form data:', this.teamForm.value); // Log form data after validation

    const formData = this.teamForm.value;
    const teamData: Partial<Team> = {
      name: formData.name,
      leaderId: parseInt(formData.leaderId, 10),
      members: formData.members.split(',').map((m: string) => m.trim()).filter(Boolean),
    };

    console.log('Team data to be sent:', teamData); // Log team data before API call

    const action = this.team?.id
      ? this.teamService.updateTeam(this.team.id, teamData)
      : this.teamService.createTeam(teamData as Team);

    action.subscribe({
      next: (updatedTeam) => {
        console.log('Team saved successfully:', updatedTeam); // Log success message
        this.teamChange.emit(updatedTeam);
        this.closeDialog();
      },
      error: (error) => console.error('Error saving team:', error), // Log error message
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

