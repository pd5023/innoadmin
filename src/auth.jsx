import { createContext, useContext, useState, useCallback } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("admin_token");
    const n = localStorage.getItem("admin_name");
    return t ? { token: t, name: n } : null;
  });

  const login = useCallback((token, name) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_name", name);
    setUser({ token, name });
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      await fetch(`${import.meta.env.VITE_API_URL ?? ""}/admin/api/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    setUser(null);
  }, []);

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);