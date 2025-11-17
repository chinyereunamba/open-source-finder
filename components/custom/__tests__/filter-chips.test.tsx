import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterChips, { FilterChip } from "../filter-chips";

describe("FilterChips", () => {
  const mockChips: FilterChip[] = [
    { id: "1", label: "TypeScript", value: "typescript", type: "language" },
    { id: "2", label: "React", value: "react", type: "topic" },
    { id: "3", label: "Beginner", value: "beginner", type: "difficulty" },
  ];

  it("renders nothing when chips array is empty", () => {
    const { container } = render(<FilterChips chips={[]} onRemove={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders all chips with correct labels", () => {
    render(<FilterChips chips={mockChips} onRemove={vi.fn()} />);

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const handleRemove = vi.fn();
    const user = userEvent.setup();

    render(<FilterChips chips={mockChips} onRemove={handleRemove} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(handleRemove).toHaveBeenCalledWith("1");
  });

  it("shows clear all button when multiple chips and onClear provided", () => {
    const handleClear = vi.fn();

    render(
      <FilterChips chips={mockChips} onRemove={vi.fn()} onClear={handleClear} />
    );

    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("calls onClear when clear all button is clicked", async () => {
    const handleClear = vi.fn();
    const user = userEvent.setup();

    render(
      <FilterChips chips={mockChips} onRemove={vi.fn()} onClear={handleClear} />
    );

    await user.click(screen.getByText("Clear all"));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("does not show remove button for non-removable chips", () => {
    const nonRemovableChips: FilterChip[] = [
      {
        id: "1",
        label: "Fixed Filter",
        value: "fixed",
        type: "status",
        removable: false,
      },
    ];

    render(<FilterChips chips={nonRemovableChips} onRemove={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: /remove/i })
    ).not.toBeInTheDocument();
  });
});
