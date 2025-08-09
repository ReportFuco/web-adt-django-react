import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userIcon from "../../assets/icons/user-solid.svg";
import lockIcon from "../../assets/icons/lock-solid.svg";
import googleIcon from "../../assets/icons/google-brands-solid.svg";
import facebookIcon from "../../assets/icons/facebook-f-brands-solid.svg";
import xIcon from "../../assets/icons/x-twitter-brands-solid black.svg";
import backgroundImage from "../../assets/fondo-web.jpg";
import { useAuth } from "../../context/AuthContext";

const InputWithIcon = ({ icon, placeholder, type, name, register, error }) => (
  <div className="relative hover:scale-105 transition-transform duration-300">
    <img
      src={icon}
      alt={placeholder}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
    />
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, {
        required: `El campo ${placeholder.toLowerCase()} es obligatorio`,
      })}
      className="w-full pl-10 p-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
    />
    {error && <p className="text-red-400 text-sm mt-1">{error.message}</p>}
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0" />
      <div className="absolute bg-neutral-950/80 backdrop-blur-lg p-8 rounded-lg shadow-lg text-white w-96 z-10">
        <h2 className="text-2xl font-bold text-center mb-8">Iniciar Sesión</h2>

        {loginError && (
          <p className="text-red-500 text-center mb-4">{loginError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputWithIcon
            icon={userIcon}
            type="text"
            placeholder="Usuario o Email"
            name="username"
            register={register}
            error={errors.username}
          />
          <InputWithIcon
            icon={lockIcon}
            type="password"
            placeholder="Contraseña"
            name="password"
            register={register}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-neutral-900 py-3 rounded-lg text-white font-semibold transition-transform duration-300 ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-neutral-500 hover:scale-105"
            }`}
          >
            {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-500" />
          <h2 className="mx-3 text-gray-400">O inicia sesión con</h2>
          <div className="flex-grow border-t border-gray-500" />
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          {[googleIcon, facebookIcon, xIcon].map((icon, i) => (
            <button
              key={i}
              type="button"
              className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
            >
              <img src={icon} alt="Social Icon" className="w-8 h-8" />
            </button>
          ))}
        </div>

        <div className="mt-4 text-center flex justify-center gap-4">
          <a href="/forgot-password" className="text-blue-400 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
          <a href="/register" className="text-blue-400 hover:underline">
            Crear cuenta
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
