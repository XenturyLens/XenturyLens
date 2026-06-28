import { describe, it, expect } from "vitest";
import { resolveInitialTheme } from "./theme";

describe("resolveInitialTheme", () => {
  it("uses stored value when present", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });
  it("ignores invalid stored values", () => {
    expect(resolveInitialTheme("purple", false)).toBe("light");
  });
  it("falls back to system preference when unset", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(null, false)).toBe("light");
  });
});
