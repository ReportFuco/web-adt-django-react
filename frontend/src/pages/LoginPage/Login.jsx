import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

import backgroundImage from "../../assets/fondo-web.jpg";
import { useAuth } from "../../context/AuthContext";

const InputWithIcon = ({
  icon: Icon,
  placeholder,
  type,
  name,
  register,
  error,
  validate,
}) => (
  <div className="relative hover:scale-[1.01] transition-transform duration-300">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/75" />
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, validate)}
      className="w-full pl-10 p-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder:text-white/45"
    />
    {error && <p className="text-red-400 text-sm mt-1 text-center">{error.message}</p>}
  </div>
);

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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0" />

      <div className="relative bg-neutral-950/80 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md z-10 border border-white/10 text-white">
        <div className="mb-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45 mb-3 font-semibold">
            Adictos al Techno
          </p>
          <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
          <p className="text-sm text-white/55 mt-2">
            Accede a tu cuenta para comentar y seguir conectado con la escena.
          </p>
        </div>

        {loginError && (
          <div className="mb-4 border border-red-400/20 bg-red-400/10 rounded-lg px-4 py-3 text-center text-sm text-red-300">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputWithIcon
            icon={FaUser}
            type="text"
            placeholder="Usuario o correo"
            name="username"
            register={register}
            error={errors.username}
            validate={{
              required: "El usuario o correo es obligatorio",
            }}
          />

          <InputWithIcon
            icon={FaLock}
            type="password"
            placeholder="Contraseña"
            name="password"
            register={register}
            error={errors.password}
            validate={{
              required: "La contraseña es obligatoria",
            }}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-2 bg-neutral-900 py-3 rounded-lg text-white font-semibold transition-transform duration-300 ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-neutral-500 hover:scale-[1.01]"
            }`}
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
          <Link to="/forgot-password" className="text-cyan-300 hover:text-cyan-200 transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="text-white/45">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-cyan-300 hover:text-cyan-200 transition-colors">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
