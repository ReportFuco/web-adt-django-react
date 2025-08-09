import { useForm } from "react-hook-form";
import { postContact } from "../../services/api";
import { useState } from "react";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [submitStatus, setSubmitStatus] = useState(null);

  const onSubmit = async (data) => {
    try {
      const payload = {
        nombre_contacto: data.userName,
        apellido_contacto: data.lastName,
        email: data.mail,
        telefono: data.number,
        asunto: data.subject,
        mensaje: data.message,
      };

      await postContact(payload);
      setSubmitStatus({
        success: true,
        message: "¡Mensaje enviado con éxito!",
      });
      reset();
    } catch (e) {
      console.error("Error al enviar la info", e);
      setSubmitStatus({
        success: false,
        message: "Error al enviar el mensaje. Por favor intenta nuevamente.",
      });
    }
  };
  return (
    <section className="flex justify-center my-20 mx-2">
      <div className="max-w-2xl">
        {submitStatus && (
          <div
            className={`mb-4 p-4 rounded-md ${
              submitStatus.success
                ? "bg-green-800 text-green-100"
                : "bg-red-800 text-red-100"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Contacto
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Completa el formulario y nos pondremos en contacto contigo
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="userName"
                type="text"
                {...register("userName", {
                  required: "Este campo es obligatorio",
                })}
                placeholder="Ej: Juan"
                className={`w-full px-4 py-2 bg-neutral-800 border ${
                  errors.userName ? "border-red-500" : "border-neutral-900"
                } rounded-xs text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
              />
              {errors.userName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                {...register("lastName", {
                  required: "Este campo es obligatorio",
                })}
                placeholder="Ej: Pérez"
                className={`w-full px-4 py-2 bg-neutral-800 border ${
                  errors.lastName ? "border-red-500" : "border-neutral-900"
                } rounded-xs text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="mail"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="mail"
              type="email"
              {...register("mail", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ingresa un email válido",
                },
              })}
              placeholder="Ej: contacto@example.com"
              className={`w-full px-4 py-2 bg-neutral-800 border ${
                errors.mail ? "border-red-500" : "border-neutral-900"
              } rounded-xs text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
            />
            {errors.mail && (
              <p className="mt-1 text-sm text-red-400">{errors.mail.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Teléfono
            </label>
            <input
              id="number"
              type="tel"
              {...register("number")}
              placeholder="Ej: 56911112222"
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-900 rounded-xs text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
            />
          </div>

          {/* Botón de envío */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 mt-4 bg-neutral-800 hover:bg-neutral-900 text-white font-medium rounded-xs shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar Mensaje"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Form;
