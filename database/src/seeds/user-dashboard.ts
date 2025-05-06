import { faker } from '@faker-js/faker';
import { TaskStatus } from '@backend/typeorm/task.entity';


const coreTeamMembers = [
  {
    id: 1,
    username: 'araiva',
    firstName: 'Araiva',
    lastName: 'Aviara',
    imageUrl: 'https://avatarfiles.alphacoders.com/825/82567.jpg',
    teams: [{ id: 1, name: 'Good Geek' }] 
  },
  {
    id: 2,
    username: 'viruskizz',
    firstName: 'Viruskizz',
    lastName: 'Zziksuriv',
    imageUrl: 'https://avatarfiles.alphacoders.com/358/358011.jpg',
    teams: [{ id: 1, name: 'Good Geek' }]
  },
  {
    id: 3,
    username: 'aporlo',
    firstName: 'Aporlo',
    lastName: 'Olropa',
    imageUrl: 'https://avatarfiles.alphacoders.com/926/thumb-1920-92694.gif',
    teams: [{ id: 1, name: 'Good Geek' }]
  }
];

export const getUserDashboardSeeds = (userId: number) => {
  // Only include team members that are actually in the same team as this user
  // Based on team-members.ts, users 1, 2, and 3 are in team 1
  let workingWithMembers = [];
  
  // Only users 1, 2, and 3 are in team 1 according to team-members.ts
  if (userId <= 3) {
    // Filter out the current user from the team members
    workingWithMembers = coreTeamMembers.filter(member => member.id !== userId);
  } else {
    // For other users, they don't have team members in the seed data
    workingWithMembers = [];
  }
  
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
    workingWith: workingWithMembers
  };
};

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
