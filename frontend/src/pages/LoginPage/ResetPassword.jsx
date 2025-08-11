import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import lockIcon from "../../assets/icons/lock-solid.svg";
import backgroundImage from "../../assets/fondo-web.jpg";

const InputWithIcon = ({ icon, placeholder, type, value, onChange }) => (
  <div className="relative flex items-center bg-neutral-700 border border-neutral-600 rounded-xs focus-within:ring-2 focus-within:ring-blue-500 transition-transform duration-300 hover:scale-105 w-full">
    <img src={icon} alt={placeholder} className="pl-3 w-5 h-5 text-gray-400" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent outline-none text-white placeholder-gray-400 p-3"
    />
  </div>
);

export default function ResetPassword() {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await axios.post(
        `https://api.adictosaltechno.com/api/password-reset-confirm/${uidb64}/${token}/`,
        { password }
      );
      setMessage("✅ Contraseña cambiada con éxito. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage("❌ " + (error.response?.data?.error || "Intenta de nuevo"));
    } finally {
      setLoading(false);
    }
  };

  console.log(uidb64, token);
  console.log("Que pasa");
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0" />
      <div className="absolute bg-neutral-950/80 backdrop-blur-lg p-8 rounded-xs shadow-lg text-white w-96 z-10">
        <h2 className="text-2xl font-bold text-center mb-8">
          Restablecer Contraseña
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
            icon={lockIcon}
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Cambiando..." : "Cambiar contraseña"}
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
