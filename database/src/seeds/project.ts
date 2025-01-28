import { Project, User } from "@backend/typeorm";

export const projectSize = 5;

const getProjectSeeds = (): Partial<Project>[] => ([
  {
    id: 1,
    name: 'Demo project',
    description: 'This is demo project for testing purpose',
    key: 'DEMO',
    imageUrl: 'https://initiate.alphacoders.com/images/109/stretched-1920-1080-109174.jpg',
    leader: User.create({ id: 1 }),
    metadata: {
      last: 0
    }
  },
  {
    id: 2,
    name: 'ABCD project',
    description: 'This is demo project for testing purpose',
    key: 'ABCD',
    imageUrl: 'https://initiate.alphacoders.com/images/132/stretched-1920-1080-1321153.jpeg',
    leader: User.create({ id: 1 }),
    metadata: {
      last: 0
    }
  },
])
export default getProjectSeeds;