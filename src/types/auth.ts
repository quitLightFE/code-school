export type UserRole = "teacher" | "student";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface TokenPair {
  access: string;
  refresh: string;
}