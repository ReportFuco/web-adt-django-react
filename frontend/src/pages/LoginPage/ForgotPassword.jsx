import { useState } from "react";
import axios from "axios";
import backgroundImage from "../../assets/fondo-web.jpg";
import { IoIosMail } from "react-icons/io";
import { Link } from "react-router-dom";

const InputWithIcon = ({ icon: Icon, placeholder, type, value, onChange }) => {
  return (
    <div className="relative flex items-center bg-neutral-700 border border-neutral-600 rounded-xs focus-within:ring-2 focus-within:ring-blue-500 transition-transform duration-300 hover:scale-105 w-full">
      <span className="pl-3 text-gray-300">
        <Icon size={22} />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-white placeholder-gray-400 p-3"
      />
    </div>
  );
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await axios.post("https://api.adictosaltechno.com/api/password-reset/", {
        email,
      });
      setMessage(
        "✅ Te hemos enviado un correo para restablecer tu contraseña."
      );
    } catch (error) {
      setMessage("❌ " + (error.response?.data?.error || "Intenta de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0" />
      <div className="absolute bg-neutral-950/80 backdrop-blur-lg p-8 rounded-xs shadow-lg text-white w-96 z-10">
        <h2 className="text-2xl font-bold text-center mb-8">
          Recuperar Contraseña
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithIcon
            icon={IoIosMail}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-neutral-900 py-3 rounded-xs text-white font-semibold transition-transform duration-300 ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-neutral-500 hover:scale-105"
            }`}
          >
            {loading ? "Enviando..." : "Enviar correo de recuperación"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-400 hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
