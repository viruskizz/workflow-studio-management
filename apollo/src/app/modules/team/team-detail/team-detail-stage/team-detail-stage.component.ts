import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { delay, map, Observable, tap } from 'rxjs';
import { TaskStatus } from 'src/app/models/task.model';
import { TeamStage } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { AppStyleUtil } from 'src/app/utils/app-style.util';

@Component({
  selector: 'app-team-detail-stage',
  templateUrl: './team-detail-stage.component.html',
})
export class TeamDetailStageComponent implements OnInit {
  teamId?: number;
  stages: TeamStage[] = [];
  loading?: boolean;

  visible = false;
  submitted?: boolean;
  staging?: TeamStage;
  form = new FormGroup({
    id: new FormControl<number | undefined>(undefined),
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    order: new FormControl(null, [Validators.required, this.duplicatedOrderValidator()]),
    taskStatus: new FormControl(null, Validators.required),
    teamId: new FormControl<number | undefined>(undefined, Validators.required),
  });

  constructor(
    private teamService: TeamService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.teamId = 1;
    if (this.teamId) {
      this.teamService.listStages(this.teamId).subscribe({
        next: (v) => {
          this.stages = v;
        }
      })
    }
  }

  getTaskStatusStyle(status: TaskStatus) {
    return AppStyleUtil.getTaskStatusIcon(status)
  }

  add() {
    this.visible = true;
    this.form.controls.teamId.patchValue(this.teamId);
  }

  edit(stage: TeamStage) {
    this.visible = true;
    this.form.patchValue(stage as any);
    this.staging = stage;
  }

  hide() {
    this.visible = false;
    this.form.reset();
    this.submitted = false;
    this.staging = undefined;
  }

  reorder() {
    this.loading = true;
    this.teamService.reorderStages(this.teamId!).pipe(
      delay(2)
    ).subscribe({
      next: (v) => {
        this.stages = v;
        this.loading = false
      }
    });
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) { return; }
    const stage = this.form.value as unknown as TeamStage;
    console.log('stage:', stage);
    let event: Observable<TeamStage>;
    if (!this.staging) {
      event = this.teamService.createStage(this.teamId!, stage);
    } else {
      event = this.teamService.editStage(this.teamId!, stage.id!, stage).pipe(
        tap(() => {
          this.stages = this.stages.filter(s => s.id !== stage.id);
        })
      )
    }
    event.subscribe(v => {
      this.stages.push(v);
      this.stages = this.stages.slice();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `${stage.name} has been ${this.staging ? 'editted' : 'created'}`, key: 'teamDetailStage' });
      this.visible = false;
    })
  }

  remove(stage: TeamStage) {
    if (!this.teamId || !stage.id) { return; }
    this.confirmationService.confirm({
      key: 'removeTeamStage',
      message: 'Are you sure to remove',
      header: `${stage.taskStatus} - ${stage.name}`,
      accept: () => {
        this.teamService.removeStage(this.teamId!, stage.id!).subscribe({
          next: () => {
            this.stages = this.stages.filter(s => s.id !== stage.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `${stage.name} has been removed`, key: 'teamDetailStage' });
          }
        })
      },
    })
  }

  get name() { return this.form.get('name'); }
  get description() { return this.form.get('description'); }
  get taskStatus() { return this.form.get('taskStatus'); }
  get order() { return this.form.get('order'); }

  duplicatedOrderValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.staging?.order === control.value) {
        return null;
      }
      const idx = this.stages.findIndex(s => s.order === control.value);
      return idx > -1 ? {duplicatedOrder: {value: control.value}} : null;
    };
  }
}
