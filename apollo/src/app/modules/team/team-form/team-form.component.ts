import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnChanges {
  @Input() team?: Team;
  @Output() teamChange = new EventEmitter<Team>();

  @Output() onCloseEvent = new EventEmitter<Team | null>();

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  isPatch = false;
  isSubmited = false;

  teamForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    leaderId: new FormControl('', [Validators.required]),
    members: new FormControl('', Validators.required), // Comma-separated members
  });

  constructor(private teamService: TeamService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['team']?.currentValue) {
      this.isPatch = true;
      this.teamForm.patchValue({
        ...changes['team'].currentValue,
        members: changes['team'].currentValue.members?.join(', '), // Convert to comma-separated string
      });
    } else {
      this.isPatch = false;
    }
  }

  onSave() {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }
  
    console.log('Form Data:', this.teamForm.value);
  
    const body: Partial<Team> = {
      name: this.teamForm.value.name ?? '',
      leaderId: this.teamForm.value.leaderId ? parseInt(this.teamForm.value.leaderId, 10) : undefined,
      members: this.teamForm.value.members
        ?.split(',')
        .map((m) => m.trim())
        .filter(Boolean) || [],
    };
  
    this.isSubmited = true;
  
    if (this.isPatch && this.team?.id) {
      this.teamService.updateTeam(this.team.id, body).subscribe({
        next: (updatedTeam) => {
          this.onCloseEvent.emit({ ...this.team, ...updatedTeam });
          this.visible = false;
        },
        error: (error) => {
          console.error('Error updating team:', error);
        }
      });
    } else {
      this.teamService.createTeam(body as Team).subscribe({
        next: (newTeam) => {
          this.onCloseEvent.emit(newTeam);
          this.visible = false;
        },
        error: (error) => {
          console.error('Error creating team:', error);
        }
      });
    }
  }

  onCancel() {
    this.visible = false;
    this.onHide();
  }

  onHide() {
    if (!this.isSubmited) {
      this.onCloseEvent.emit(null);
    }
    this.visible = false;
    this.isSubmited = false;
    this.teamForm.reset();
  }

  get name() {
    return this.teamForm.get('name');
  }
  get members() {
    return this.teamForm.get('members');
  }
  get leaderId() {
    return this.teamForm.get('leaderId');
  }
}