import { User } from '@entities/user.entity';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2'

const assignedUsers: Partial<User>[] = [
  {
    username: 'araiva',
    password: '123456',
    firstName: 'Araiva',
    lastName: 'Aviara',
    email: 'araiva@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/825/82567.jpg',
  },
  {
    username: 'viruskizz',
    password: '123456',
    firstName: 'Viruskizz',
    lastName: 'Zziksuriv',
    email: 'viruskizz@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/358/358011.jpg',
  },
  {
    username: 'aporlo',
    password: '123456',
    firstName: 'Aporlo',
    lastName: 'Olropa',
    email: 'aporlo@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/926/thumb-1920-92694.gif',
  },
  {
    username: 'abcde',
    password: '123456',
    firstName: 'Abcde',
    lastName: 'Xyz',
    email: 'abcde@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/926/thumb-1920-92694.gif',
  },
  {
    username: 'xyz',
    password: '123456',
    firstName: 'Xyz',
    lastName: 'Abc',
    email: 'xyz@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/372/thumb-1920-372992.jpg',
  }
];

function createRandomUser(): Partial<User> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    password: faker.internet.password({ length: 12 }),
    username: faker.internet.userName({ firstName, lastName }),
    email: faker.internet.email({ firstName, lastName }),
    imageUrl: faker.image.avatar()
  }
}
const randomUsers = faker.helpers.multiple(createRandomUser, { count: 20 });

const getUserSeeds = async (): Promise<Partial<User>[]> => {
  const users = assignedUsers.concat(randomUsers);
  const userSeeds = [];
  for(let i = 0; i < users.length; i++) {
    const user = users[i];
    userSeeds.push({
      ...user,
      id: i + 1,
      password: await argon2.hash(user.password)
    });
  }
  return userSeeds;
} 
export default getUserSeeds;
