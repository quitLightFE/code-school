import { api } from "#/lib/api";
import type { LoginDto, RegisterDto, TokenPair, User } from "#/types/auth";

export const AuthService = {
  register(data: RegisterDto) {
    return api.post("/auth/register/", data);
  },

  login(data: LoginDto) {
    return api.post<TokenPair>("/auth/login/", data);
  },

  me() {
    return api.get<User>("/auth/me/");
  },

  refresh(refresh: string) {
    return api.post<{ access: string }>("/auth/refresh/", {
      refresh
    });
  }
};
