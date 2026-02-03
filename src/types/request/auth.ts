import type { User } from '@/types/user';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};
