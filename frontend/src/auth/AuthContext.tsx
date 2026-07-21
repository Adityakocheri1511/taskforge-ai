import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authApi, setAccessToken } from "../api/client";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    const { data } = await authApi.get<User>("/api/v1/auth/me");
    setUser(data);
  };

  // On mount: just TRY to refresh. If the httpOnly cookie is there, we're back in.
  // We can't read the cookie to check first — that's exactly the point.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authApi.post("/api/v1/auth/refresh", {});
        setAccessToken(data.access_token);
        await loadMe();
      } catch {
        setAccessToken(null);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.post("/api/v1/auth/login", { email, password });
    setAccessToken(data.access_token);   // cookie was set by the server
    await loadMe();
  };

  const register = async (email: string, name: string, password: string) => {
    await authApi.post("/api/v1/auth/register", { email, name, password });
    await login(email, password);
  };

  const logout = async () => {
    try {
      await authApi.post("/api/v1/auth/logout");  // only the server can clear it
    } catch {
      /* ignore — clear locally regardless */
    }
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}