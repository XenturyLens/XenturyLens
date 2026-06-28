import { describe, it, expect } from "vitest";
import { contactSchema } from "./contact-schema";

describe("contactSchema", () => {
  it("accepts a valid enquiry", () => {
    const r = contactSchema.safeParse({
      name: "Ada", email: "ada@example.com", company: "Analytical", message: "We are building a platform.",
    });
    expect(r.success).toBe(true);
  });
  it("rejects a bad email", () => {
    const r = contactSchema.safeParse({ name: "Ada", email: "nope", company: "", message: "Hello there friend." });
    expect(r.success).toBe(false);
  });
  it("requires a message of reasonable length", () => {
    const r = contactSchema.safeParse({ name: "Ada", email: "ada@example.com", company: "", message: "hi" });
    expect(r.success).toBe(false);
  });
});
