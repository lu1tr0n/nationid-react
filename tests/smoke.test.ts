import { describe, expect, it } from "vitest";

/**
 * Smoke test that verifies the test harness boots end-to-end. Components and
 * hooks land in their own test files; this one only exists so the matrix
 * does not skip the `Test` step on an empty test suite.
 */
describe("@nationid/react harness", () => {
  it("boots vitest with the jsdom environment", () => {
    expect(typeof document).toBe("object");
    expect(document.createElement("div")).toBeTruthy();
  });
});
