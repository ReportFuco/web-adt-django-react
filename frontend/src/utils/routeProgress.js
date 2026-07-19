/**
 * Controlador del overlay de progreso de ruta (Fase 7 §B). Vive fuera del
 * boundary de <Suspense> a propósito: el fallback de Suspense se desmonta en
 * cuanto el chunk resuelve, así que por sí solo no puede garantizar que el
 * usuario vea el salto final a 100 — este módulo coordina esa secuencia con
 * un pub/sub simple que RouteProgressOverlay consume vía
 * useSyncExternalStore, y que lazyWithProgress alimenta desde cada import().
 */

const SHOW_DELAY_MS = 150;
const HOLD_AT_100_MS = 150;
const MAX_AUTO_PROGRESS = 92;
const TICK_MS = 200;

let state = { visible: false, value: 0 };
const listeners = new Set();

let pendingCount = 0;
let showTimer = null;
let tickTimer = null;
let hideTimer = null;

function setState(partial) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener(state));
}

function clearTimers() {
  clearTimeout(showTimer);
  clearInterval(tickTimer);
  clearTimeout(hideTimer);
  showTimer = null;
  tickTimer = null;
  hideTimer = null;
}

function tick() {
  setState({ value: state.value + (MAX_AUTO_PROGRESS - state.value) * 0.15 + 1 });
  if (state.value >= MAX_AUTO_PROGRESS) {
    setState({ value: MAX_AUTO_PROGRESS });
    clearInterval(tickTimer);
    tickTimer = null;
  }
}

function start() {
  pendingCount += 1;
  if (pendingCount > 1) return;

  clearTimers();
  setState({ visible: false, value: 0 });

  showTimer = setTimeout(() => {
    showTimer = null;
    setState({ visible: true, value: 8 });
    tickTimer = setInterval(tick, TICK_MS);
  }, SHOW_DELAY_MS);
}

function finish() {
  pendingCount = Math.max(0, pendingCount - 1);
  if (pendingCount > 0) return;

  if (!state.visible) {
    clearTimers();
    setState({ visible: false, value: 0 });
    return;
  }

  clearInterval(tickTimer);
  tickTimer = null;
  setState({ value: 100 });
  hideTimer = setTimeout(() => {
    hideTimer = null;
    setState({ visible: false, value: 0 });
  }, HOLD_AT_100_MS);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

/** Solo para tests: vuelve el módulo a su estado inicial y limpia timers. */
function reset() {
  clearTimers();
  pendingCount = 0;
  state = { visible: false, value: 0 };
}

export const routeProgress = {
  start,
  done: finish,
  fail: finish,
  subscribe,
  getSnapshot,
  reset,
};
