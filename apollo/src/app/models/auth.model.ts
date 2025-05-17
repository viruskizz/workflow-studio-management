import { User } from "./user.model";

export interface SignInResponse {
  access_token: string;
}

export interface AuthSignUpResponse {
  user: User;
  authUser: Auth;
}

export interface AuthUser {
  username: string;
  roles?: string[];
  role?: string;
  sub: number;
  iat: number;
  exp: number;
}

export interface Auth {
  id?: number;
  username: string;
  provider: AuthProvider;
  token: string;
  refreshToken: string;
  expiredAt: Date;
  issueAt: Date;
}
export enum AuthProvider {
  FDNET = 'FDNET'
}