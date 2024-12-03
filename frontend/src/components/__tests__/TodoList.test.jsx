import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoList from "../TodoList";
import * as api from "../../services/api";

// Mock API calls
vi.mock("../../services/api", () => ({
  getTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

describe("TodoList", () => {
  const mockTodos = [
    { id: 1, title: "Test Todo 1", completed: false },
    { id: 2, title: "Test Todo 2", completed: true },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    api.getTodos.mockResolvedValue({ data: mockTodos });
  });

  it("renders todo list", async () => {
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    });
  });

  it("adds new todo", async () => {
    const newTodo = { id: 3, title: "New Todo", completed: false };
    api.createTodo.mockResolvedValue({ data: newTodo });

    render(<TodoList />);

    const input = screen.getByPlaceholderText("Add new todo");
    const button = screen.getByText("Add Todo");

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.createTodo).toHaveBeenCalledWith({ title: "New Todo" });
    });
  });

  it("toggles todo completion", async () => {
    render(<TodoList />);

    await waitFor(() => {
      const checkbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(checkbox);
      expect(api.updateTodo).toHaveBeenCalledWith(1, {
        id: 1,
        title: "Test Todo 1",
        completed: true,
      });
    });
  });

  it("deletes todo", async () => {
    render(<TodoList />);

    await waitFor(() => {
      const deleteButton = screen.getAllByText("Delete")[0];
      fireEvent.click(deleteButton);
      expect(api.deleteTodo).toHaveBeenCalledWith(1);
    });
  });
});
