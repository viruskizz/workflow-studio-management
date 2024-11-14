export interface SignInResponse {
  access_token: string;
}

export interface AuthUser {
  username: string;
  roles?: string[];
  role?: string;
  sub: number;
  iat: number;
  exp: number;
}