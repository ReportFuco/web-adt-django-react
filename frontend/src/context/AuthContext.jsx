import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

import { clearAuthStorage, ensureValidAccessToken, getLogin } from "../services/api";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("accessToken");
    try {
      return storedToken ? jwtDecode(storedToken) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const restoreSession = async () => {
      const validToken = await ensureValidAccessToken();
      if (validToken) {
        setToken(validToken);
        setUser(jwtDecode(validToken));
        return;
      }
      setToken(null);
      setUser(null);
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", token);
      try {
        setUser(jwtDecode(token));
      } catch {
        clearAuthStorage();
        setToken(null);
        setUser(null);
      }
    } else {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  }, [token]);

  const loginUser = async (username, password) => {
    const res = await getLogin(username, password);
    if (res.success) {
      setToken(res.access);
      localStorage.setItem("refreshToken", res.refresh);
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider value={{ token, user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
