export function getLocalDate(dateString) {
  if (!dateString) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
}

export function getEventDateItems(event) {
  const dates = Array.isArray(event?.fechas) && event.fechas.length > 0
    ? event.fechas.map((dateItem) => ({
        id: dateItem.id,
        fecha: dateItem.fecha,
      }))
    : event?.fecha_hora
      ? [{ id: "legacy", fecha: event.fecha_hora }]
      : event?.fecha
        ? [{ id: "legacy", fecha: event.fecha }]
        : [];

  return dates
    .filter((dateItem) => {
      const date = getLocalDate(dateItem.fecha);
      return date && !Number.isNaN(date.getTime());
    })
    .sort((a, b) => getLocalDate(a.fecha) - getLocalDate(b.fecha));
}

function joinNatural(parts) {
  if (parts.length <= 1) return parts[0] || "";
  if (parts.length === 2) return parts.join(" y ");
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

function sameMonthAndYear(dates) {
  if (dates.length === 0) return false;
  const first = dates[0];
  return dates.every(
    (date) => date.getFullYear() === first.getFullYear() && date.getMonth() === first.getMonth()
  );
}

function sameYear(dates) {
  if (dates.length === 0) return false;
  const firstYear = dates[0].getFullYear();
  return dates.every((date) => date.getFullYear() === firstYear);
}

function weekday(date) {
  return date.toLocaleDateString("es-ES", { weekday: "long" });
}

function month(date) {
  return date.toLocaleDateString("es-ES", { month: "long" });
}

export function formatFullEventDate(dateString) {
  const date = getLocalDate(dateString);
  if (!date || Number.isNaN(date.getTime())) return "";
  return formatFullDateObject(date);
}

function formatFullDateObject(date) {
  return `${weekday(date)} ${date.getDate()} de ${month(date)} de ${date.getFullYear()}`;
}

export function formatEventDateRange(dateItems) {
  const dates = dateItems
    .map((dateItem) => getLocalDate(dateItem.fecha))
    .filter((date) => date && !Number.isNaN(date.getTime()));

  if (dates.length === 0) return "";
  if (dates.length === 1) return formatFullEventDate(dateItems[0].fecha);

  if (sameMonthAndYear(dates)) {
    const days = dates.map((date) => `${weekday(date)} ${date.getDate()}`);
    return `${joinNatural(days)} de ${month(dates[0])} de ${dates[0].getFullYear()}`;
  }

  if (sameYear(dates)) {
    const dateParts = dates.map((date) => `${weekday(date)} ${date.getDate()} de ${month(date)}`);
    return `${joinNatural(dateParts)} de ${dates[0].getFullYear()}`;
  }

  return joinNatural(dates.map((date) => formatFullDateObject(date)));
}

export function formatEventDateBadge(dateItems) {
  const dates = dateItems
    .map((dateItem) => getLocalDate(dateItem.fecha))
    .filter((date) => date && !Number.isNaN(date.getTime()));

  if (dates.length === 0) return "";

  const parts = dates.map((date) => (
    date.toLocaleDateString("es-ES", { weekday: "short", day: "2-digit" }).replace(".", "")
  ));
  const monthLabel = dates[0].toLocaleDateString("es-ES", { month: "short" }).replace(".", "");

  if (sameMonthAndYear(dates)) {
    return `${joinNatural(parts)} ${monthLabel}`.toUpperCase();
  }

  return joinNatural(
    dates.map((date) => date.toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short" }).replaceAll(".", ""))
  ).toUpperCase();
}
