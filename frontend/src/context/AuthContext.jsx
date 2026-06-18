import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

const getDashboardPath = (role) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "COMPANY") {
    return "/company/dashboard";
  }

  return "/student/dashboard";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("skillproof_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("skillproof_token");
  });

  const [loading, setLoading] = useState(false);

  const saveAuth = (authData) => {
    localStorage.setItem("skillproof_token", authData.token);
    localStorage.setItem("skillproof_user", JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (formData) => {
    const response = await axiosClient.post("/auth/login", formData);
    saveAuth(response.data);
    return response.data.user;
  };

  const register = async (formData) => {
    const response = await axiosClient.post("/auth/register", formData);
    saveAuth(response.data);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem("skillproof_token");
    localStorage.removeItem("skillproof_user");
    setToken(null);
    setUser(null);
  };

  const refreshMe = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axiosClient.get("/auth/me");
      localStorage.setItem("skillproof_user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      getDashboardPath,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};