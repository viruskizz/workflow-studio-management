import { User } from '@entities/user.entity';
import * as argon2 from 'argon2'

const getUserSeed = async (): Promise<Partial<User>[]> => [
  {
    id: 1,
    username: 'araiva',
    password: await argon2.hash('123456'),
    firstName: 'Araiva',
    lastName: 'Aviara',
    email: 'araiva@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/825/82567.jpg',
  },
  {
    id: 2,
    username: 'viruskizz',
    password: await argon2.hash('123456'),
    firstName: 'Viruskizz',
    lastName: 'Zziksuriv',
    email: 'viruskizz@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/358/358011.jpg',
  },
  {
    id: 3,
    username: 'aporlo',
    password: await argon2.hash('123456'),
    firstName: 'Aporlo',
    lastName: 'Olropa',
    email: 'aporlo@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/926/thumb-1920-92694.gif',
  },
  {
    id: 4,
    username: 'kthitiwut',
    password: await argon2.hash('123456'),
    firstName: 'Thitiwut',
    lastName: 'Somsa',
    email: 'kthitiwut@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/353/353809.png',
  },
  {
    id: 5,
    username: 'abcde',
    password: await argon2.hash('123456'),
    firstName: 'Abcde',
    lastName: 'Xyz',
    email: 'abcde@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/926/thumb-1920-92694.gif',
  },
  {
    id: 6,
    username: 'xyz',
    password: await argon2.hash('123456'),
    firstName: 'Xyz',
    lastName: 'Abc',
    email: 'xyz@gmail.com',
    imageUrl: 'https://avatarfiles.alphacoders.com/372/thumb-1920-372992.jpg',
  }
];

export default getUserSeed;
