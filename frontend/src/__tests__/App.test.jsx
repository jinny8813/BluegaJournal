import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import App from "../App";

// Mock the global fetch function
vi.stubGlobal("fetch", vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "Hello, World!" }),
  })
));

describe("App", () => {
  it("renders the message from the API", async () => {
    render(<App />);
    
    // Wait for the message to appear
    await waitFor(() => {
      expect(screen.getByText(/Hello, World!/i)).toBeInTheDocument();
    });
  });
});
