export type UserRole = "teacher" | "student";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface TokenPair {
  access: string;
  refresh: string;
}
