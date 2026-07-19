import PropTypes from "prop-types";

/**
 * Motivo de marca (DESIGN.md §8): dos "eslabones" encadenados = "adictos"
 * al techno. Aparece en wordmark, overlines, tickers y placeholders de Media.
 */
function LinkGlyph({ size = 24, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="7" width="8" height="10" rx="4" />
      <rect x="13" y="7" width="8" height="10" rx="4" />
    </svg>
  );
}

LinkGlyph.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

export default LinkGlyph;
