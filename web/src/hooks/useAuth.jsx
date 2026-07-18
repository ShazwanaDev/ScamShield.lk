import { createContext, useCallback, useContext, useState } from "react";
import { mockLogin, mockRegister } from "../lib/api.js";

const USER_KEY = "scamshield_mock_user";
const ADMIN_KEY = "scamshield_mock_admin";

const AuthContext = createContext(null);

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Frontend-only mock auth session. No real backend auth exists yet (see lib/api.js), so
 * "logging in" just stores a fake token locally — this is not real access control and
 * must not be treated as one if this app ships beyond a demo/research context.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_KEY) === "1");

  const login = useCallback(async (email, password) => {
    const account = await mockLogin(email, password);
    localStorage.setItem(USER_KEY, JSON.stringify(account));
    setUser(account);
    return account;
  }, []);

  const register = useCallback(async (email, password) => {
    const account = await mockRegister(email, password);
    localStorage.setItem(USER_KEY, JSON.stringify(account));
    setUser(account);
    return account;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const adminLogin = useCallback((passphrase) => {
    const configured = import.meta.env.VITE_ADMIN_PASSPHRASE;
    if (!configured) return { ok: false, reason: "not_configured" };
    if (passphrase !== configured) return { ok: false, reason: "wrong" };
    sessionStorage.setItem(ADMIN_KEY, "1");
    setIsAdmin(true);
    return { ok: true };
  }, []);

  const adminLogout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    isAdmin,
    adminLogin,
    adminLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
