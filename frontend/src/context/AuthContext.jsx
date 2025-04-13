import { createContext, useState, useEffect, useContext } from "react";
import { getLogin } from "../services/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("accessToken");
    return storedToken ? jwtDecode(storedToken) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", token);
      setUser(jwtDecode(token));
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
