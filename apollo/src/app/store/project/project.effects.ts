import { loadTasks, loadTasksTree, setTasks, setTasksTree, addTask, updateTask, displayErrorMessage } from './project.actions';
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { AppState, ProjectActions, ProjectSelectors } from '..';
import { TaskService } from 'src/app/services/task.service';

@Injectable()
export class ProjectEffects {
  private actions$ = inject(Actions);
  private projectService = inject(ProjectService);
  constructor(
    private store: Store<AppState>,
    private taskService: TaskService,
  ) { }

  loadTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTasks),
      exhaustMap((action) => this.projectService.listTasks(action.projectId).pipe(
        map((tasks) => setTasks({ tasks }),
        )
      )));
  })

  loadTaskTrees$ = createEffect(() => this.actions$.pipe(
    ofType(loadTasksTree),
    withLatestFrom(this.store.select(ProjectSelectors.selectProjectId)),
    exhaustMap(([action, projectId]) => !projectId ? [] : this.projectService.listTaskTrees(projectId).pipe(
      map((taskTree) => setTasksTree({ taskTree }))
    ))
  ));

  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(addTask),
    withLatestFrom(this.store.select(ProjectSelectors.selectProjectId)),
    exhaustMap(([action, projectId]) => {
      if (!projectId) return [];
      return this.taskService.create({ ...action.task, projectId }).pipe(
        map((task) => ProjectActions.loadTasks({ projectId })),
        catchError((e) => of(displayErrorMessage({ message: e.error?.message || 'Failed to add task' })))
      );
    })
  ));

  updateTask$ = createEffect(() => this.actions$.pipe(
    ofType(updateTask),
    withLatestFrom(this.store.select(ProjectSelectors.selectProjectId)),
    exhaustMap(([action, projectId]) => {
      if (!projectId) return [];
      return this.taskService.update({ ...action.task, projectId }).pipe(
        map((task) => ProjectActions.loadTasks({ projectId })),
      );
    })
  ));
}
