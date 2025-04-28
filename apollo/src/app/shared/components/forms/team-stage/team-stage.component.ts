import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TeamService } from 'src/app/services/team.service';
interface DropdownItem {
  value: number;
  label: string;
}

@Component({
  selector: 'app-team-stage',
  templateUrl: './team-stage.component.html',
})
export class TeamStageComponent implements OnChanges, OnInit {
  @Input() label = 'value'
  @Input() selectedStage?: any;
  @Output() selectedStageChanged = new EventEmitter<DropdownItem>()
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input() ngClass?: string | any[] | object;
  @Input() teamId?: number;

  stages: DropdownItem[] = [];
  loading = false;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    if (this.teamId) {
      this.teamService.listStages(this.teamId).subscribe({
        next: (v) => {
          console.log(v);
        }
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']?.currentValue) {
      const value = this.form.controls[this.controlName].value;
      this.selectedStage = this.stages.find(s => s.value === value);
    }
    if (changes['teamId']?.currentValue) {
      this.loading = true;
      const teamId = changes['teamId'].currentValue;
      this.teamService.listStages(teamId).subscribe({
        next: (v) => {
          this.stages = v.map(v => ({
            value: v.id!,
            label: v.name,
          }));
          this.loading = false;
        }
      })
    }
  }

  onChange(event: any) {
    this.form.controls[this.controlName].patchValue(event.value)
  }

  getItem(stage: DropdownItem) {
    return this.stages.find(s => s.value === stage.value)
  }
}
