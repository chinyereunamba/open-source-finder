import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterChips, { FilterChip } from "../filter-chips";

describe("FilterChips", () => {
  const mockOnRemove = jest.fn();
  const mockOnClear = jest.fn();

  const sampleChips: FilterChip[] = [
    {
      id: "lang-js",
      label: "JavaScript",
      value: "JavaScript",
      type: "language",
    },
    {
      id: "topic-beginner",
      label: "beginner-friendly",
      value: "beginner-friendly",
      type: "topic",
    },
    {
      id: "diff-easy",
      label: "Beginner",
      value: "Beginner",
      type: "difficulty",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when no chips provided", () => {
    const { container } = render(
      <FilterChips chips={[]} onRemove={mockOnRemove} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all provided chips", () => {
    render(<FilterChips chips={sampleChips} onRemove={mockOnRemove} />);

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("beginner-friendly")).toBeInTheDocument();
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });

  it("calls onRemove when chip remove button is clicked", () => {
    render(<FilterChips chips={sampleChips} onRemove={mockOnRemove} />);

    const removeButtons = screen.getAllByRole("button");
    fireEvent.click(removeButtons[0]);

    expect(mockOnRemove).toHaveBeenCalledWith("lang-js");
  });

  it("shows clear all button when multiple chips and onClear provided", () => {
    render(
      <FilterChips
        chips={sampleChips}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("calls onClear when clear all button is clicked", () => {
    render(
      <FilterChips
        chips={sampleChips}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByText("Clear all");
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it("applies correct color classes based on chip type", () => {
    render(<FilterChips chips={sampleChips} onRemove={mockOnRemove} />);

    const jsChip = screen.getByText("JavaScript").closest("div");
    const topicChip = screen.getByText("beginner-friendly").closest("div");
    const diffChip = screen.getByText("Beginner").closest("div");

    expect(jsChip).toHaveClass("text-blue-700");
    expect(topicChip).toHaveClass("text-green-700");
    expect(diffChip).toHaveClass("text-orange-700");
  });
});
