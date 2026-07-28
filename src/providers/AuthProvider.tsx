"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";

import { AuthService } from "#/services/auth.service";
import { tokens } from "#/lib/tokens";
import type { LoginDto, RegisterDto, TokenPair, User } from "#/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login(data: LoginDto): Promise<void>;
  register(data: RegisterDto): Promise<void>;
  logout(): void;

  refreshUser(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const { data } = await AuthService.me();
      setUser(data);
    } catch {
      setUser(null);
    }
  }

  async function login(data: LoginDto) {
    const res = await AuthService.login(data);

    tokens.set(res.data.access, res.data.refresh);

    await refreshUser();
  }

  async function register(data: RegisterDto) {
    await AuthService.register(data);
  }

  function logout() {
    tokens.clear();
    setUser(null);
  }

  useEffect(() => {
    async function init() {
      if (!tokens.getAccess()) {
        setLoading(false);
        return;
      }

      await refreshUser();
      setLoading(false);
    }

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}
