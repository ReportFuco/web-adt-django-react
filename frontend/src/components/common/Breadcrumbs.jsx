import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-white/80 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-white/70" : ""}>{item.label}</span>
              )}
              {!isLast && <span className="text-white/25">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
