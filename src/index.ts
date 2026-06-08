/**
 * `@nationid/react` — React components and hooks built on top of the
 * framework-agnostic `nationid` validator.
 *
 * v0.1 ships:
 *  - `<DocumentInput>` — controlled input that validates on blur against the
 *    canonical spec for a given `(country, code)` pair.
 *  - `<DocumentDisplay>` — read-only formatted output (mask applied).
 *  - `<CountrySelect>` and `<DocumentTypeSelect>` — minimal a11y-correct
 *    dropdowns wired to `nationid/catalog`.
 *  - `useDocumentSpec(code)` / `useDocumentValidate(country, code)` — hooks
 *    for callers that want to drive their own UI.
 *
 * Styling is headless by default. Import `@nationid/react/styles.css` to
 * pick up the optional baseline styles, or pass `className` props through to
 * adopt the host project's design system.
 */
export {};
