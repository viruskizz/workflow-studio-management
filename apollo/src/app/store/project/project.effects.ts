import { loadTasks, setTasks } from './project.actions';
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Injectable()
export class ProjectEffects {
  private actions$ = inject(Actions);
  private projectService = inject(ProjectService);

  fetchTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTasks),
      exhaustMap((action) => this.projectService.listTasks(action.projectId).pipe(
        map((tasks) => setTasks({ tasks }),
        )
      )));
  })
}