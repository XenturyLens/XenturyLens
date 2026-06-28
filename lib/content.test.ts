import { describe, it, expect } from "vitest";
import { services, process, work, stats, people, hero, nav } from "./content";

describe("content", () => {
  it("has the four services in order", () => {
    expect(services.map((s) => s.title)).toEqual([
      "Strategy", "Design", "Engineering", "Stewardship",
    ]);
  });
  it("has the four process steps", () => {
    expect(process.map((p) => p.title)).toEqual(["Frame", "Design", "Build", "Endure"]);
  });
  it("has three featured-capable work items including Africarstruck", () => {
    expect(work.length).toBeGreaterThanOrEqual(3);
    expect(work.some((w) => w.name === "Africarstruck")).toBe(true);
  });
  it("has three stats and four people", () => {
    expect(stats).toHaveLength(3);
    expect(people).toHaveLength(4);
  });
  it("has hero copy and nav links to all routes", () => {
    expect(hero.title).toMatch(/hundred years/i);
    expect(nav.map((n) => n.href)).toEqual(
      expect.arrayContaining(["/work", "/services", "/studio", "/contact"])
    );
  });
});
