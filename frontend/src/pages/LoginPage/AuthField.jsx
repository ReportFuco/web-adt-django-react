import PropTypes from "prop-types";

/** Input con ícono para formularios de auth, tokens del sistema (PLAN.md Fase 5). */
function AuthField({ icon: Icon, placeholder, type, name, register, validate, error, value, onChange }) {
  const inputProps = register ? register(name, validate) : { value, onChange };

  return (
    <div>
      <div className="flex min-h-11 items-center gap-3 rounded-adt border border-control-line bg-surface px-3.5 focus-within:border-signal">
        <Icon className="h-[18px] w-[18px] shrink-0 text-text-muted" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-text placeholder:text-text-muted focus:outline-none"
          {...inputProps}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error.message}</p>}
    </div>
  );
}

AuthField.propTypes = {
  icon: PropTypes.elementType.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  register: PropTypes.func,
  validate: PropTypes.object,
  error: PropTypes.shape({ message: PropTypes.string }),
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default AuthField;
