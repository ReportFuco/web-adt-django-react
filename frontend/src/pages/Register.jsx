import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/api"; // Usamos useApi()

function Register() {
  const navigate = useNavigate();
  const { register } = useApi(); // Obtenemos la función de registro desde useApi()

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Manejar los cambios en los inputs de forma dinámica
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para manejar el registro
  const handleRegister = async (e) => {
    e.preventDefault();

    const { email, username, password, confirmPassword } = formData;

    if (!email || !username || !password || !confirmPassword) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await register({ email, username, password });

      if (result.success) {
        navigate("/login"); // Redirigir al login si el registro es exitoso
      } else {
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
    } catch (error) {
      setError("Error en el registro, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-8">Crear Cuenta</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
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
