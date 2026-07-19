import { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { API_BASE_URL } from "../../config/api";
import AuthLayout from "./AuthLayout";
import AuthField from "./AuthField";
import Cta from "../../components/ui/Cta";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}password-reset/`, { email });
      setMessage({ type: "success", text: "Te hemos enviado un correo para restablecer tu contraseña." });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recuperar contraseña"
      footer={
        <Link to="/login" className="hover:text-signal">
          Volver al login
        </Link>
      }
    >
      {message && (
        <p className={`mb-4 text-center text-sm ${message.type === "success" ? "text-signal" : "text-red-400"}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          icon={Mail}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Cta type="submit" variant="primary" disabled={loading} className="mt-2 w-full justify-center disabled:opacity-60">
          {loading ? "Enviando…" : "Enviar correo de recuperación"}
        </Cta>
      </form>
    </AuthLayout>
  );
}
