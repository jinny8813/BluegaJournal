import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoList from "../TodoList";
import * as api from "../../services/api";

// Mock API
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
    vi.clearAllMocks();
    // 修正 mock 返回值
    api.getTodos.mockResolvedValue(mockTodos);
    api.createTodo.mockImplementation((todo) =>
      Promise.resolve({ ...todo, id: Math.random() })
    );
  });

  it("renders loading state initially", () => {
    render(<TodoList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders todo list after loading", async () => {
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    });
  });

  it("adds new todo successfully", async () => {
    const newTodo = { id: 3, title: "New Todo", completed: false };
    api.createTodo.mockResolvedValueOnce(newTodo);

    render(<TodoList />);
    await waitFor(() => screen.getByPlaceholderText("Add new todo"));

    const input = screen.getByPlaceholderText("Add new todo");
    const button = screen.getByText("Add Todo");

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.createTodo).toHaveBeenCalledWith({
        title: "New Todo",
        completed: false,
      });
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });
  });

  it("toggles todo completion", async () => {
    render(<TodoList />);

    await waitFor(() => {
      const checkbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(checkbox);
    });

    expect(api.updateTodo).toHaveBeenCalledWith(1, {
      id: 1,
      title: "Test Todo 1",
      completed: true,
    });
  });

  it("deletes todo", async () => {
    render(<TodoList />);

    await waitFor(() => {
      const deleteButton = screen.getAllByText("Delete")[0];
      fireEvent.click(deleteButton);
    });

    expect(api.deleteTodo).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    api.getTodos.mockRejectedValueOnce(new Error("API Error"));

    render(<TodoList />);

    await waitFor(() => {
      expect(
        screen.getByText("Error: Failed to fetch todos")
      ).toBeInTheDocument();
    });
  });
});
