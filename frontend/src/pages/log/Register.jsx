import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import backgroundImage from "../../assets/fondo.webp";
import { registerUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import React from "react";

const InputWithIcon = ({
  icon: Icon,
  placeholder,
  type,
  name,
  register,
  error,
  validate,
}) => (
  <div className="relative hover:scale-105 transition-transform duration-300">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, validate)}
      className="w-full pl-10 p-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
    />
    {error && <p className="text-red-400 text-sm mt-1 text-center">{error.message}</p>}
  </div>
);

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      password2: data.confirmpassword,
    };
    const result = await registerUser(payload);
    if (result.success) {
      navigate("/login");
    } else {
      console.error("Error en el registro:", result.error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0" />
      <div className="absolute bg-neutral-950/80 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md z-10">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <InputWithIcon
            icon={FaUser}
            type="text"
            placeholder="Usuario"
            name="username"
            register={register}
            error={errors.username}
            validate={{
              required: "Nombre es requerido",
              minLength: {
                value: 4,
                message: "Mínimo 4 caracteres",
              },
              maxLength: {
                value: 15,
                message: "Máximo 15 caracteres",
              },
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "Solo letras y números",
              },
              noSpaces: (value) =>
                !/\s/.test(value) || "No se permiten espacios",
            }}
          />

          <InputWithIcon
            icon={FaUser}
            type="text"
            placeholder="Nombre"
            name="first_name"
            register={register}
            error={errors.first_name}
            validate={{
              required: "El nombre es requerido",
              maxLength: {
                value: 15,
                message: "Máximo 15 caracteres",
              },
              noSpaces: (value) =>
                !/\s/.test(value) || "No se permiten espacios",
            }}
          />

          <InputWithIcon
            icon={FaUser}
            type="text"
            placeholder="Apellido"
            name="last_name"
            register={register}
            error={errors.last_name}
            validate={{
              required: "El apellido es obligatorio",
              noSpaces: (value) =>
                !/\s/.test(value) || "No se permiten espacios",
            }}
          />

          <InputWithIcon
            icon={FaEnvelope}
            type="text"
            placeholder="Correo electrónico"
            name="email"
            register={register}
            error={errors.email}
            validate={{
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido",
              },
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
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres",
              },
            }}
          />

          <InputWithIcon
            icon={FaLock}
            type="password"
            placeholder="Confirmar contraseña"
            name="confirmpassword"
            register={register}
            error={errors.confirmpassword}
            validate={{
              required: "Confirmar la contraseña es obligatorio",
              validate: (value) =>
                value === watch("password") || "Las contraseñas no coinciden",
            }}
          />

          <button
            type="submit"
            className="w-full mt-4 bg-neutral-900 py-3 rounded-lg text-white font-semibold transition-transform duration-300 hover:bg-neutral-500 hover:scale-105"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
