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
      setSubmitStatus({ success: true, message: "¡Mensaje enviado con éxito!" });
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
    <section className="px-4 py-20 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-0 border" style={{ borderColor: "var(--border)" }}>
        <div className="theme-panel p-8 md:p-12 flex flex-col justify-between min-h-[420px]">
          <div>
            <p className="section-title-kicker mb-5">Contacto / editorial / alianzas</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6" style={{ color: "var(--text)" }}>
              Hablemos
            </h2>
            <p className="text-base md:text-lg max-w-md theme-text-soft leading-relaxed">
              Si quieres colaborar, publicar, activar una campaña o simplemente conectar con la comunidad,
              este es el canal correcto.
            </p>
          </div>

          <div className="mt-10 space-y-5">
            <div className="border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold theme-text-muted mb-2">Correo</p>
              <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>adictos.al.techno@gmail.com</p>
            </div>
            <div className="border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold theme-text-muted mb-2">Enfoque</p>
              <p className="theme-text-soft">Eventos · Noticias · Cultura · Comunidad</p>
            </div>
          </div>
        </div>

        <div className="theme-panel-strong p-8 md:p-12">
          {submitStatus && (
            <div
              className="mb-6 p-4 text-sm uppercase tracking-[0.16em] font-medium"
              style={
                submitStatus.success
                  ? { background: "var(--brand)", color: "var(--brand-contrast)" }
                  : { border: "1px solid rgba(220,38,38,.35)", color: "#fca5a5", background: "rgba(127,29,29,.12)" }
              }
            >
              {submitStatus.message}
            </div>
          )}

          <div className="mb-8">
            <p className="section-title-kicker mb-3">Formulario de contacto</p>
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight" style={{ color: "var(--text)" }}>
              Cuéntanos qué necesitas
            </h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="userName" className="block text-[11px] font-bold mb-2 uppercase tracking-[0.22em] theme-text-muted">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="userName"
                  type="text"
                  {...register("userName", { required: "Este campo es obligatorio" })}
                  placeholder="Ej: Juan"
                  className="w-full px-4 py-3 theme-input focus:outline-none"
                />
                {errors.userName && <p className="mt-2 text-sm text-red-400">{errors.userName.message}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-[11px] font-bold mb-2 uppercase tracking-[0.22em] theme-text-muted">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName", { required: "Este campo es obligatorio" })}
                  placeholder="Ej: Pérez"
                  className="w-full px-4 py-3 theme-input focus:outline-none"
                />
                {errors.lastName && <p className="mt-2 text-sm text-red-400">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mail" className="block text-[11px] font-bold mb-2 uppercase tracking-[0.22em] theme-text-muted">
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
                  className="w-full px-4 py-3 theme-input focus:outline-none"
                />
                {errors.mail && <p className="mt-2 text-sm text-red-400">{errors.mail.message}</p>}
              </div>

              <div>
                <label htmlFor="number" className="block text-[11px] font-bold mb-2 uppercase tracking-[0.22em] theme-text-muted">
                  Teléfono
                </label>
                <input
                  id="number"
                  type="tel"
                  {...register("number")}
                  placeholder="Ej: 56911112222"
                  className="w-full px-4 py-3 theme-input focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-[11px] font-bold mb-2 uppercase tracking-[0.22em] theme-text-muted">
                Asunto
              </label>
              <input
                id="subject"
                type="text"
                {...register("subject")}
                placeholder="Ej: Colaboración, prensa, difusión, alianza"
                className="w-full px-4 py-3 theme-input focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-[11px] font-bold mb-2 uppercase tracking-[0.22em] theme-text-muted">
                Mensaje
              </label>
              <textarea
                id="message"
                rows="6"
                {...register("message")}
                placeholder="Cuéntanos un poco más sobre lo que necesitas..."
                className="w-full px-4 py-3 theme-input focus:outline-none resize-y min-h-[160px]"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs uppercase tracking-[0.18em] theme-text-muted">
                Respondemos según disponibilidad y prioridad editorial.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`theme-button px-8 py-4 text-xs font-bold uppercase tracking-[0.28em] transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Form;
