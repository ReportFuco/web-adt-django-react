import { useState } from "react";
import { useForm } from "react-hook-form";
import Kicker from "../ui/Kicker";
import Cta from "../ui/Cta";
import { postContact } from "../../services/api";

const inputClass =
  "min-h-11 rounded-adt border border-control-line bg-surface px-3.5 py-3 text-text transition-colors duration-[var(--adt-dur-fast)] focus:border-signal focus:outline-none";

/**
 * Formulario de contacto (DESIGN.md §9.6 — `contact`/`field`). Campos
 * alineados al contrato real de `Contacto` (DECISIONES.md #7: sin
 * `mensaje`/`asunto`, apellido y nombre requeridos, teléfono opcional).
 */
function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const onSubmit = async (data) => {
    // Honeypot: campo oculto que solo un bot rellenaría.
    if (data.website) return;

    setStatus(null);
    try {
      await postContact({
        nombre_contacto: data.nombre_contacto,
        apellido_contacto: data.apellido_contacto,
        email: data.email,
        telefono: data.telefono || undefined,
      });
      setStatus("success");
      reset();
    } catch (error) {
      console.error("Error al enviar el formulario de contacto", error);
      setStatus("error");
    }
  };

  return (
    <section id="contacto" className="bg-bg-soft py-24" aria-labelledby="contact-heading">
      <div className="wrap grid gap-12 min-[861px]:grid-cols-[1fr_1.3fr]">
        <div>
          <Kicker>Contacto</Kicker>
          <h2 id="contact-heading" className="text-[clamp(1.75rem,3vw,2.75rem)]">
            Hablemos
          </h2>
          <p className="mt-4 max-w-[38ch] text-text-soft">
            Prensa, colaboraciones, propuestas de cobertura o alianzas con la comunidad.
          </p>
          <dl className="mt-6 grid gap-6">
            <div>
              <dt className="mb-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-text-muted">Email</dt>
              <dd>
                <a href="mailto:adictos.al.techno@gmail.com" className="hover:text-signal">
                  adictos.al.techno@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-text-muted">
                Cobertura
              </dt>
              <dd>Noticias · Eventos · Cultura · Entrevistas</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} aria-label="Formulario de contacto" noValidate>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">No completar</label>
            <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          <div className="mb-6 grid gap-6 min-[521px]:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-nombre" className="text-xs font-bold uppercase tracking-[0.05em] text-text-soft">
                Nombre
              </label>
              <input
                id="f-nombre"
                type="text"
                autoComplete="given-name"
                maxLength={50}
                className={inputClass}
                aria-invalid={!!errors.nombre_contacto}
                {...register("nombre_contacto", { required: "El nombre es obligatorio" })}
              />
              {errors.nombre_contacto && (
                <p className="text-sm text-red-400">{errors.nombre_contacto.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-apellido" className="text-xs font-bold uppercase tracking-[0.05em] text-text-soft">
                Apellido
              </label>
              <input
                id="f-apellido"
                type="text"
                autoComplete="family-name"
                maxLength={50}
                className={inputClass}
                aria-invalid={!!errors.apellido_contacto}
                {...register("apellido_contacto", { required: "El apellido es obligatorio" })}
              />
              {errors.apellido_contacto && (
                <p className="text-sm text-red-400">{errors.apellido_contacto.message}</p>
              )}
            </div>
          </div>

          <div className="mb-6 grid gap-6 min-[521px]:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-email" className="text-xs font-bold uppercase tracking-[0.05em] text-text-soft">
                Email
              </label>
              <input
                id="f-email"
                type="email"
                autoComplete="email"
                maxLength={100}
                className={inputClass}
                aria-invalid={!!errors.email}
                {...register("email", { required: "El email es obligatorio" })}
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-telefono" className="text-xs font-bold uppercase tracking-[0.05em] text-text-soft">
                Teléfono <span className="normal-case font-normal">(opcional)</span>
              </label>
              <input
                id="f-telefono"
                type="tel"
                autoComplete="tel"
                maxLength={11}
                className={inputClass}
                {...register("telefono")}
              />
            </div>
          </div>

          <p className="mb-6 -mt-2 text-xs text-text-muted">
            Al enviar aceptas que te respondamos por email o WhatsApp.
          </p>

          <div role="status" aria-live="polite" className="mb-4 empty:hidden">
            {status === "success" && (
              <p className="text-sm font-semibold text-signal">Mensaje enviado. Te responderemos pronto.</p>
            )}
            {status === "error" && (
              <p className="text-sm font-semibold text-red-400">
                No se pudo enviar el mensaje. Intenta de nuevo en unos minutos.
              </p>
            )}
          </div>

          <Cta type="submit" variant="primary" disabled={isSubmitting} className="disabled:opacity-60">
            {isSubmitting ? "Enviando…" : "Enviar mensaje"}
          </Cta>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
