import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock } from "lucide-react";

import { API_BASE_URL } from "../../config/api";
import AuthLayout from "./AuthLayout";
import AuthField from "./AuthField";
import Cta from "../../components/ui/Cta";

export default function ResetPassword() {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}password-reset-confirm/${uidb64}/${token}/`, { password });
      setMessage({ type: "success", text: "Contraseña cambiada con éxito. Redirigiendo al login…" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Restablecer contraseña"
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
          icon={Lock}
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Cta type="submit" variant="primary" disabled={loading} className="mt-2 w-full justify-center disabled:opacity-60">
          {loading ? "Cambiando…" : "Cambiar contraseña"}
        </Cta>
      </form>
    </AuthLayout>
  );
}
