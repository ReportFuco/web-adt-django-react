import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token") || ""); // 🔥 Agregamos token
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Error decodificando el token:", error);
        logout();
      }
    }
  }, [token]); // 🔥 Ahora se actualiza cuando cambia el token

  const login = (newToken) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken); // 🔥 Guardar token en el estado
    const decoded = jwtDecode(newToken);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(""); // 🔥 Resetear el token
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
