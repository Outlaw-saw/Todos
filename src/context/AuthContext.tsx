import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'token';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    console.log('[AuthContext] login fetch to:', `${BASE_URL}/auth/login`);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log('[AuthContext] login response status:', res.status);
      if (!res.ok) {
        const body = await res.text();
        console.log('[AuthContext] login response body:', body);
        return false;
      }
      const data = await res.json();
      console.log('[AuthContext] login success, token received');
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
      return true;
    } catch (err) {
      console.error('[AuthContext] login exception:', err);
      return false;
    }
  }, []);

  const register = useCallback(async (username: string, password: string): Promise<boolean> => {
    console.log('[AuthContext] register fetch to:', `${BASE_URL}/auth/register`);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log('[AuthContext] register response status:', res.status);
      if (!res.ok) {
        const body = await res.text();
        console.log('[AuthContext] register response body:', body);
      }
      return res.ok;
    } catch (err) {
      console.error('[AuthContext] register exception:', err);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: token !== null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
