import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";
import AuthField from "./AuthField";
import Cta from "../../components/ui/Cta";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const onSubmit = async (data) => {
    setLoginError("");
    const response = await loginUser(data.username, data.password);
    if (!response.success) {
      setLoginError(response.error || "Credenciales inválidas");
      return;
    }
    reset();
    navigate("/");
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      footer={
        <>
          <Link to="/forgot-password" className="hover:text-signal">
            ¿Olvidaste tu contraseña?
          </Link>
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-text hover:text-signal">
              Crear cuenta
            </Link>
          </p>
        </>
      }
    >
      {loginError && (
        <div className="mb-4 border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-300">
          {loginError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AuthField
          icon={User}
          type="text"
          placeholder="Usuario o correo"
          name="username"
          register={register}
          error={errors.username}
          validate={{ required: "El usuario o correo es obligatorio" }}
        />
        <AuthField
          icon={Lock}
          type="password"
          placeholder="Contraseña"
          name="password"
          register={register}
          error={errors.password}
          validate={{ required: "La contraseña es obligatoria" }}
        />
        <Cta type="submit" variant="primary" disabled={isSubmitting} className="mt-2 w-full justify-center disabled:opacity-60">
          {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
        </Cta>
      </form>
    </AuthLayout>
  );
}

export default Login;
