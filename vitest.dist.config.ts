import { defineConfig } from "vitest/config";

/**
 * Smoke tests against the built tarball — verifies that the published
 * `dist/` exposes the documented subpath exports, default exports, and types
 * before the changeset bot ships a release.
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    pool: "threads",
    // No dist smoke tests until v0.1 ships its first component; vitest
    // would otherwise fail the matrix step with "No test files found".
    passWithNoTests: true,
    include: ["tests/dist/**/*.test.{ts,tsx}"],
    exclude: ["node_modules"],
  },
});
