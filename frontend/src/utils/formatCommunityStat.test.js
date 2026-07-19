import { describe, expect, it } from "vitest";
import { formatCommunityStat } from "./formatCommunityStat";

describe("formatCommunityStat", () => {
  it("formatea miles con separador es-CL (punto), no coma en-US", () => {
    expect(formatCommunityStat(35613)).toBe("35.613");
  });

  it("no agrega separador para números menores a 1000", () => {
    expect(formatCommunityStat(157)).toBe("157");
    expect(formatCommunityStat(280)).toBe("280");
  });

  it("soporta millones con múltiples separadores", () => {
    expect(formatCommunityStat(1234567)).toBe("1.234.567");
  });
});
