import axe from "axe-core";
import { expect } from "vitest";

/**
 * Run `axe-core` against a DOM node and fail the current test if any
 * accessibility rules are violated. Mirrors what `vitest-axe` would do
 * without taking on a peer-dep that has not shipped a vitest 3.x release.
 */
export async function expectNoA11yViolations(node: Element): Promise<void> {
  const results = await axe.run(node, {
    rules: {
      // jsdom does not implement layout, so axe's colour-contrast rule has
      // no meaningful input. Disable it; we will catch contrast issues in
      // the playground / browser-based snapshot tests, not here.
      "color-contrast": { enabled: false },
    },
  });
  expect(
    results.violations,
    `axe-core found ${results.violations.length} a11y violation(s):\n${results.violations
      .map((v) => `  - ${v.id}: ${v.help} — ${v.nodes.length} node(s)`)
      .join("\n")}`,
  ).toEqual([]);
}
