import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// 擴展 Vitest 的 expect
expect.extend(matchers);

// 每個測試後清理
afterEach(() => {
  cleanup();
});
