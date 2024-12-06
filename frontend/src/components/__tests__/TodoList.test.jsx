// TodoList.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TodoList from "./TodoList";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../services/api";

// Mock API 服務
vi.mock("../services/api", () => ({
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
    // 重置所有 mock
    vi.clearAllMocks();
    // 設置默認返回值
    getTodos.mockResolvedValue(mockTodos);
  });

  test("renders loading state initially", () => {
    render(<TodoList />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("renders todos after loading", async () => {
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  test("adds new todo", async () => {
    const newTodo = { id: 3, title: "New Todo", completed: false };
    createTodo.mockResolvedValue(newTodo);

    render(<TodoList />);
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const input = screen.getByTestId("todo-input");
    const addButton = screen.getByTestId("add-button");

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });
    expect(createTodo).toHaveBeenCalledWith({
      title: "New Todo",
      completed: false,
    });
  });

  test("toggles todo completion", async () => {
    render(<TodoList />);
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const checkbox = screen.getByTestId("todo-checkbox-1");
    fireEvent.click(checkbox);

    expect(updateTodo).toHaveBeenCalledWith(1, {
      id: 1,
      title: "Test Todo 1",
      completed: true,
    });
  });

  test("deletes todo", async () => {
    render(<TodoList />);
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("todo-delete-1");
    fireEvent.click(deleteButton);

    expect(deleteTodo).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
    });
  });

  test("handles error state", async () => {
    getTodos.mockRejectedValue(new Error("Failed to fetch"));
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
