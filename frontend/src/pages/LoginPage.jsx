import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { jwtDecode } from "jwt-decode";
import userIcon from "../assets/icons/user-solid.svg";
import lockIcon from "../assets/icons/lock-solid.svg";
import googleIcon from "../assets/icons/google-brands-solid.svg";
import facebookIcon from "../assets/icons/facebook-f-brands-solid.svg";
import xIcon from "../assets/icons/x-twitter-brands-solid black.svg";


console.log(jwtDecode(localStorage.getItem("access_token")))
// Componente reutilizable para inputs con ícono
const InputWithIcon = ({ icon, type, placeholder, value, onChange }) => (
  <div className="relative hover:scale-105 transition-transform duration-300">
    <img
      src={icon}
      alt={placeholder}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
    />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 p-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

function LoginContainer() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Función para manejar el login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const result = await login(identifier, password); // Petición al backend

      if (result.success) {
        const token = result.token; // Extraer el token del resultado
        localStorage.setItem("access_token", token);
        console.log(result.username)
        console.log(result.is_superuser)

        // Decodificar el token para obtener el username
        const decoded = jwtDecode(token);
        console.log("Usuario autenticado:", decoded.username);
        console.log("Es superusuario:", decoded.is_superuser);

        navigate("/");
        window.location.reload(); // Recargar la app para actualizar el estado global

      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('./assets/fondo.webp')] bg-cover bg-fixed opacity-60">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0"></div>
      <div className="absolute bg-black p-8 rounded-lg shadow-lg text-white w-96 z-10">
        <h2 className="text-2xl font-bold text-center mb-8">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <InputWithIcon
            icon={userIcon}
            type="text"
            placeholder="Usuario o Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <InputWithIcon
            icon={lockIcon}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-300">
              Recordarme
            </label>
          </div>
          <button
            type="submit"
            className={`w-full bg-neutral-900 py-3 rounded-lg text-white font-semibold transition-transform duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-500 hover:scale-105"
            }`}
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-500"></div>
          <h2 className="mx-3 text-gray-400">O inicia sesión con</h2>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            type="button"
            className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <img src={googleIcon} alt="Google" className="w-8 h-8" />
          </button>
          <button
            type="button"
            className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
          </button>
          <button
            type="button"
            className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <img src={xIcon} alt="Otra red social" className="w-8 h-8" />
          </button>
        </div>
        <div className="mt-4 text-center flex justify-center gap-4">
          <a href="/forgot-password" className="text-blue-400 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
          <Link to="/register" className="text-blue-400 hover:underline">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}



export default LoginContainer;
