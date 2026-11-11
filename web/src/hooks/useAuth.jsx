import { createContext, useCallback, useContext, useState } from "react";
import { adminSignIn, adminSignOut, getAdminToken, mockLogin, mockRegister } from "../lib/api.js";
import { demoProfile, seedDemoAccount } from "../data/demoAccount.js";

const USER_KEY = "scamshield_mock_user";

const AuthContext = createContext(null);

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    const user = raw ? JSON.parse(raw) : null;
    // Returning demo account: make sure its sample data is there before the first render.
    if (user?.email) seedDemoAccount(user.email);
    return user;
  } catch {
    return null;
  }
}

/**
 * User accounts are still a frontend-only mock: no backend user auth exists yet (see
 * lib/api.js), so "logging in" just stores a fake token locally and is not real access
 * control. Admin sign-in is real: the backend checks the passphrase and issues a signed
 * token, and the moderation API refuses requests without it.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [isAdmin, setIsAdmin] = useState(() => Boolean(getAdminToken()));

  const login = useCallback(async (email, password) => {
    const account = { ...(await mockLogin(email, password)), ...demoProfile(email) };
    seedDemoAccount(account.email);
    localStorage.setItem(USER_KEY, JSON.stringify(account));
    setUser(account);
    return account;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const trimmed = String(name || "").trim();
    const account = { ...(await mockRegister(email, password)), ...(trimmed ? { name: trimmed } : {}), ...demoProfile(email) };
    seedDemoAccount(account.email);
    localStorage.setItem(USER_KEY, JSON.stringify(account));
    setUser(account);
    return account;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  /** Throws ApiError on failure (401 wrong passphrase, 429 too many tries, 503 not set up). */
  const adminLogin = useCallback(async (passphrase) => {
    await adminSignIn(passphrase);
    setIsAdmin(true);
  }, []);

  const adminLogout = useCallback(() => {
    adminSignOut();
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
