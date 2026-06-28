import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Eyebrow from "./Eyebrow";
import Button from "./Button";
import Stat from "./Stat";

describe("primitives", () => {
  it("Eyebrow renders its label", () => {
    render(<Eyebrow>Selected work</Eyebrow>);
    expect(screen.getByText("Selected work")).toBeInTheDocument();
  });
  it("Button renders a link to its href", () => {
    render(<Button href="/work">See our work</Button>);
    const link = screen.getByRole("link", { name: "See our work" });
    expect(link).toHaveAttribute("href", "/work");
  });
  it("Stat renders the value and label", () => {
    render(<Stat value="40+" label="Products shipped" />);
    expect(screen.getByText("40+")).toBeInTheDocument();
    expect(screen.getByText("Products shipped")).toBeInTheDocument();
  });
});
