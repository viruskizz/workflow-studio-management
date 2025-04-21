import { TaskStatus } from "../models/task.model";

export class AppStyleUtil {
  static getTaskStatusIcon(status: TaskStatus) {
    const data = {
      'BACKLOG': {
        label: 'Backlog',
        icon: 'pi pi-circle-fill',
        styleClass: 'bg-surface-400 text-white',
      },
      'TODO': {
        label: 'Todo',
        icon: 'pi pi-circle',
        styleClass: 'bg-cyan-400 text-white',
      },
      'IN_PROGRESS': {
        label: 'In Progress',
        icon: 'pi pi-spinner',
        styleClass: 'bg-orange-400 text-white',
      },
      'DONE': {
        label: 'Done',
        icon: 'pi pi-check-circle',
        styleClass: 'bg-green-400 text-white',
      },
      'CANCELLED': {
        label: 'Cancelled',
        icon: 'pi pi-times-circle',
        styleClass: 'bg-red-400 text-white',
      },
    };
    return data[status];
  }
}