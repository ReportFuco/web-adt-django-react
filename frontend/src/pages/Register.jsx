// pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";


function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    // Validar que se hayan completado todos los campos
    if (!email || !username || !password || !confirmPassword) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    // Validar que las contraseñas sean iguales
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setLoading(true);

    // Preparar los datos para el registro
    const userData = {
      email,
      username,
      password,
      password2: confirmPassword,
    };

    const result = await register(userData);
    if (result.success) {
      navigate("/login");
    } else {
      // Si result.error es un objeto (por ejemplo, con errores por campo) extraemos un mensaje
      let errorMessage = "";
      if (typeof result.error === "object") {
        errorMessage = Object.values(result.error)[0];
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(", ");
        }
      } else {
        errorMessage = result.error;
      }
      setError(errorMessage || "Ocurrió un error al crear la cuenta.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-8">Crear Cuenta</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition-transform duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 hover:scale-105"
            }`}
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
