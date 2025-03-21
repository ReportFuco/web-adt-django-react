import { createContext, useState, useEffect, useContext } from "react";


export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [token]);

  const loginUser = async (username, password) => {
    const response = await login(username, password);
    if (response.success) {
      setToken(response.token);
    }
    return response;
  };

  const logoutUser = () => {
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
