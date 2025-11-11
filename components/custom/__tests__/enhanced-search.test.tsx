import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnhancedSearch from "../enhanced-search";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe("EnhancedSearch", () => {
  const mockOnChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("renders search input with placeholder", () => {
    render(
      <EnhancedSearch
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        placeholder="Test placeholder"
      />
    );

    expect(screen.getByPlaceholderText("Test placeholder")).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    render(
      <EnhancedSearch
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "React" } });

    expect(mockOnChange).toHaveBeenCalledWith("React");
  });

  it("calls onSearch when Enter key is pressed", () => {
    render(
      <EnhancedSearch
        value="React"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("React");
  });

  it("shows suggestions when typing", async () => {
    render(
      <EnhancedSearch
        value="React"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Suggestions")).toBeInTheDocument();
    });
  });

  it("clears input when clear button is clicked", () => {
    render(
      <EnhancedSearch
        value="React"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith("");
  });
});
