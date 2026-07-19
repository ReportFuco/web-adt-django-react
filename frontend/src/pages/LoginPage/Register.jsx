import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Lock, Mail, User } from "lucide-react";

import { registerUser } from "../../services/api";
import AuthLayout from "./AuthLayout";
import AuthField from "./AuthField";
import Cta from "../../components/ui/Cta";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
    <AuthLayout
      title="Crear cuenta"
      footer={
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-text hover:text-signal">
            Iniciar sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AuthField
          icon={User}
          type="text"
          placeholder="Usuario"
          name="username"
          register={register}
          error={errors.username}
          validate={{
            required: "Nombre es requerido",
            minLength: { value: 4, message: "Mínimo 4 caracteres" },
            maxLength: { value: 15, message: "Máximo 15 caracteres" },
            pattern: { value: /^[A-Za-z0-9]+$/, message: "Solo letras y números" },
            noSpaces: (value) => !/\s/.test(value) || "No se permiten espacios",
          }}
        />
        <AuthField
          icon={User}
          type="text"
          placeholder="Nombre"
          name="first_name"
          register={register}
          error={errors.first_name}
          validate={{
            required: "El nombre es requerido",
            maxLength: { value: 15, message: "Máximo 15 caracteres" },
            noSpaces: (value) => !/\s/.test(value) || "No se permiten espacios",
          }}
        />
        <AuthField
          icon={User}
          type="text"
          placeholder="Apellido"
          name="last_name"
          register={register}
          error={errors.last_name}
          validate={{
            required: "El apellido es obligatorio",
            noSpaces: (value) => !/\s/.test(value) || "No se permiten espacios",
          }}
        />
        <AuthField
          icon={Mail}
          type="text"
          placeholder="Correo electrónico"
          name="email"
          register={register}
          error={errors.email}
          validate={{
            required: "El correo es obligatorio",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo inválido" },
          }}
        />
        <AuthField
          icon={Lock}
          type="password"
          placeholder="Contraseña"
          name="password"
          register={register}
          error={errors.password}
          validate={{
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          }}
        />
        <AuthField
          icon={Lock}
          type="password"
          placeholder="Confirmar contraseña"
          name="confirmpassword"
          register={register}
          error={errors.confirmpassword}
          validate={{
            required: "Confirmar la contraseña es obligatorio",
            validate: (value) => value === watch("password") || "Las contraseñas no coinciden",
          }}
        />
        <Cta type="submit" variant="primary" disabled={isSubmitting} className="mt-2 w-full justify-center disabled:opacity-60">
          {isSubmitting ? "Creando cuenta…" : "Registrarse"}
        </Cta>
      </form>
    </AuthLayout>
  );
}

export default Register;
