import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { routeProgress } from "./routeProgress";

describe("routeProgress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    routeProgress.reset();
  });

  afterEach(() => {
    routeProgress.reset();
    vi.useRealTimers();
  });

  it("no muestra el overlay antes del delay inicial", () => {
    routeProgress.start();
    vi.advanceTimersByTime(100);
    expect(routeProgress.getSnapshot().visible).toBe(false);
  });

  it("avanza con un máximo simulado sin llegar a 100 mientras no resuelve", () => {
    routeProgress.start();
    vi.advanceTimersByTime(150);
    expect(routeProgress.getSnapshot().visible).toBe(true);

    vi.advanceTimersByTime(2000);
    const { value } = routeProgress.getSnapshot();
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);
  });

  it("al terminar salta a 100, se mantiene visible un instante y luego se oculta limpiando timers", () => {
    routeProgress.start();
    vi.advanceTimersByTime(150);
    expect(routeProgress.getSnapshot().visible).toBe(true);

    routeProgress.done();
    expect(routeProgress.getSnapshot().value).toBe(100);
    expect(routeProgress.getSnapshot().visible).toBe(true);

    vi.advanceTimersByTime(150);
    expect(routeProgress.getSnapshot().visible).toBe(false);
    expect(routeProgress.getSnapshot().value).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("loader rápido: si resuelve antes del delay inicial, nunca llega a mostrarse", () => {
    routeProgress.start();
    vi.advanceTimersByTime(50);
    routeProgress.done();
    vi.advanceTimersByTime(1000);
    expect(routeProgress.getSnapshot().visible).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("un error de importación sale igual que done(), nunca queda congelado", () => {
    routeProgress.start();
    vi.advanceTimersByTime(150);
    routeProgress.fail();
    expect(routeProgress.getSnapshot().value).toBe(100);
    vi.advanceTimersByTime(150);
    expect(routeProgress.getSnapshot().visible).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("navegaciones concurrentes: no se oculta hasta que todas terminan", () => {
    routeProgress.start();
    routeProgress.start();
    vi.advanceTimersByTime(150);
    expect(routeProgress.getSnapshot().visible).toBe(true);

    routeProgress.done();
    vi.advanceTimersByTime(150);
    expect(routeProgress.getSnapshot().visible).toBe(true);

    routeProgress.done();
    vi.advanceTimersByTime(150);
    expect(routeProgress.getSnapshot().visible).toBe(false);
  });
});
