import { describe, expect, it } from "vitest";
import { unwrapList } from "../unwrapList";

describe("unwrapList", () => {
  it("lanza cuando el sobre trae error", () => {
    const error = new Error("fallo de red");
    expect(() => unwrapList({ results: [], error })).toThrow(error);
  });

  it("devuelve los datos tal cual cuando no hay error", () => {
    const res = { results: [1, 2], count: 2, next: null, previous: null, error: null };
    expect(unwrapList(res)).toEqual(res);
  });

  it("no lanza si el sobre no tiene campo error", () => {
    const res = { results: [], count: 0, next: null, previous: null };
    expect(unwrapList(res)).toEqual(res);
  });
});
