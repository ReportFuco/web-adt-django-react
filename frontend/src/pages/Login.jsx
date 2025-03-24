import { useForm } from "react-hook-form";

function login() {
  const { register } = useForm();

  return (
    <form>
      <label htmlFor="usuario">Nombre usuario</label>
      <input type="text" {...register("usuario")} />

      <label htmlFor="password">Contraseña</label>
      <input type="password" {...register("password")} />
    </form>
  );
}

export default login;
