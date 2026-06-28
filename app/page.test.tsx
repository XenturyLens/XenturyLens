import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the hero headline and section labels", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /hundred years/i })).toBeInTheDocument();
    expect(screen.getByText("What we do")).toBeInTheDocument();
    expect(screen.getByText("Selected work")).toBeInTheDocument();
  });
});
