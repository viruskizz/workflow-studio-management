import { loadTasks, setTasks, setTasksTree } from './project.actions';
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from '@ngrx/store';
import { exhaustMap, map, withLatestFrom } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { AppState, ProjectSelectors } from '..';

@Injectable()
export class ProjectEffects {
  private actions$ = inject(Actions);
  private projectService = inject(ProjectService);
  constructor(
    private store: Store<AppState>,
  ) { }

  loadTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTasks),
      exhaustMap((action) => this.projectService.listTasks(action.projectId).pipe(
        map((tasks) => setTasks({ tasks }),
        )
      )));
  })

  loadTaskTrees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTasks),
      withLatestFrom(this.store.select(ProjectSelectors.selectProjectId)),
      exhaustMap(([action, projectId]) => {
        if (!projectId) {
          return [];
        }
        return this.projectService.listTaskTrees(projectId).pipe(
          map((taskTree) => setTasksTree({ taskTree }))
        )
      }
      )
    );
  });
}