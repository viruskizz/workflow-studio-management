import { TeamStage } from "@backend/typeorm";
import { TaskStatus } from "@backend/typeorm/task.entity";

const stages: Partial<TeamStage>[] = [
  {
    name: 'Preparing',
    taskStatus: TaskStatus.TODO,
    order: 0,
    teamId: 1,
  },
  {
    name: 'Waiting',
    taskStatus: TaskStatus.TODO,
    order: 1,
    teamId: 1,
  },
  {
    name: 'Doing',
    taskStatus: TaskStatus.IN_PROGRESS,
    order: 2,
    teamId: 1,
  },
  {
    name: 'Wait for approve',
    taskStatus: TaskStatus.IN_PROGRESS,
    order: 3,
    teamId: 1,
  },
  {
    name: 'Approved',
    taskStatus: TaskStatus.IN_PROGRESS,
    order: 4,
    teamId: 1,
  },
  {
    name: 'Rejected',
    taskStatus: TaskStatus.IN_PROGRESS,
    order: 5,
    teamId: 1,
  },
  {
    name: 'Finish',
    taskStatus: TaskStatus.DONE,
    order: 6,
    teamId: 1,
  },
  {
    name: 'Archived',
    taskStatus: TaskStatus.DONE,
    order: 7,
    teamId: 1,
  },

  // Team 2
  {
    name: 'Waiting',
    taskStatus: TaskStatus.TODO,
    order: 0,
    teamId: 2,
  },
  {
    name: 'Doing',
    taskStatus: TaskStatus.IN_PROGRESS,
    order: 1,
    teamId: 2,
  },
  {
    name: 'Approved',
    taskStatus: TaskStatus.IN_PROGRESS,
    order: 2,
    teamId: 2,
  },
  {
    name: 'Finish',
    taskStatus: TaskStatus.DONE,
    order: 3,
    teamId: 2,
  },

  // Teams
  {
    name: 'Waiting',
    taskStatus: TaskStatus.TODO,
    order: 0,
    teamId: 3,
  },
  {
    name: 'Doing',
    taskStatus: TaskStatus.IN_PROGRESS,
    order: 1,
    teamId: 3,
  },
  {
    name: 'Finish',
    taskStatus: TaskStatus.DONE,
    order: 2,
    teamId: 3,
  },
];

const getTeamStagesSeeds = () => {
  return stages;
}

export default getTeamStagesSeeds;