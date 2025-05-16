import { Auth } from "@backend/typeorm";
import { AuthProvider } from "@backend/typeorm/auth.entity";

const auths: Partial<Auth>[] = [
  {
    username: process.env.FDNET_USERNAME,
    provider: AuthProvider.FDNET_SERVER,
    expiredAt: new Date("1995-12-17T03:24:00"),
  },
  {
    username: 'kthitiwut',
    userId: 1,
    provider: AuthProvider.FDNET
  },
  {
    username: 'flalita ',
    userId: 3,
    provider: AuthProvider.FDNET
  },
];

const getAuthSeeds = () => {
  return auths;
}

export default getAuthSeeds;