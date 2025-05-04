import { User } from '@backend/typeorm';
import { faker } from '@faker-js/faker';
import { TaskStatus } from '@backend/typeorm/task.entity';

export const getUserDashboardSeeds = (userId: number) => {
  return {
    taskStats: {
      todo: faker.number.int({ min: 2, max: 8 }),
      inProgress: faker.number.int({ min: 1, max: 5 }),
      done: faker.number.int({ min: 5, max: 15 }),
      total: 0,
    },
    workingOn: [
      {
        id: 1,
        name: 'Demo project',
        description: 'This is demo project for testing purpose',
        status: TaskStatus.IN_PROGRESS,
        imageUrl: 'https://initiate.alphacoders.com/images/109/stretched-1920-1080-109174.jpg',
      },
      {
        id: 2,
        name: 'ABCD project',
        description: 'This is demo project for testing purpose',
        status: TaskStatus.TODO,
        imageUrl: 'https://initiate.alphacoders.com/images/132/stretched-1920-1080-1321153.jpeg',
      },
    ],
    workingWith: [
      {
        id: userId === 1 ? 2 : 1,
        username: userId === 1 ? 'viruskizz' : 'araiva',
        firstName: userId === 1 ? 'Viruskizz' : 'Araiva',
        lastName: userId === 1 ? 'Zziksuriv' : 'Aviara',
        imageUrl: userId === 1 
          ? 'https://avatarfiles.alphacoders.com/358/358011.jpg'
          : 'https://avatarfiles.alphacoders.com/825/82567.jpg',
        teams: [{ id: 1, name: 'GoodGeek' }]
      },
      {
        id: 3,
        username: 'aporlo',
        firstName: 'Aporlo',
        lastName: 'Olropa',
        imageUrl: 'https://avatarfiles.alphacoders.com/926/thumb-1920-92694.gif',
        teams: [{ id: 1, name: 'GoodGeek' }]
      }
    ]
  };
};

// Generate dashboard data for all users
export const getAllUserDashboardSeeds = async (userCount: number) => {
  const dashboards = [];
  
  for (let i = 1; i <= userCount; i++) {
    const dashboard = getUserDashboardSeeds(i);
    // Calculate total tasks
    dashboard.taskStats.total = 
      dashboard.taskStats.todo + 
      dashboard.taskStats.inProgress + 
      dashboard.taskStats.done;
    
    dashboards.push({
      userId: i,
      ...dashboard
    });
  }
  
  return dashboards;
};

export default getAllUserDashboardSeeds;
