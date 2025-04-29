import { useForm } from "react-hook-form";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = {
      first_name: data.userName,
      last_name: data.lastName,
      mail_contact: data.mail,
      number: data.number,
      subject: data.subject,
      message: data.message,
    };
    // Simulamos un envío con delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Datos enviados:", payload);
  };

  return (
    <>
      <Header />

      <main className="flex justify-center min-h-screen py-8">
        <div className="max-w-2xl mx-4 bg-black backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 shadow-neutral-500">
          <div className="p-8">
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
                    className={`w-full px-4 py-3 bg-gray-700 border ${
                      errors.userName ? "border-red-500" : "border-gray-600"
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
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
                    className={`w-full px-4 py-3 bg-gray-700 border ${
                      errors.lastName ? "border-red-500" : "border-gray-600"
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
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
                  className={`w-full px-4 py-3 bg-gray-700 border ${
                    errors.mail ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
                />
                {errors.mail && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.mail.message}
                  </p>
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
                  placeholder="Ej: +569 1234 5678"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Motivo <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  {...register("subject", {
                    required: "Por favor selecciona un motivo",
                    validate: (value) =>
                      value !== "" || "Debes elegir una opción válida",
                  })}
                  className={`w-full px-4 py-3 bg-gray-700 border ${
                    errors.subject ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Seleccione un motivo
                  </option>
                  <option value="ventas">Ventas</option>
                  <option value="Soporte técnico">Soporte técnico</option>
                  <option value="colaboracion">Colaboración</option>
                  <option value="web">Página Web</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows="4"
                  {...register("message", {
                    required: "Por favor escribe un mensaje",
                  })}
                  placeholder="Escribe tu consulta aquí..."
                  className={`w-full px-4 py-3 bg-gray-700 border ${
                    errors.message ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Botón de envío */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-900 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 ${
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
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ContactPage;
