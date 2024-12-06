import "@testing-library/jest-dom";
import { vi } from "vitest";

// 全局 mock
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
