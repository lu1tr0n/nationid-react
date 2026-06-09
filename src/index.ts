/**
 * `@nationid/react` — React components and hooks built on top of the
 * framework-agnostic `nationid` validator.
 *
 * v0.1 ships:
 *  - {@link DocumentInput} — controlled, accessible input that validates on
 *    blur and surfaces the error through ARIA wiring.
 *  - {@link useDocumentSpec} / {@link useDocumentValidate} — hooks for callers
 *    that want to drive their own UI.
 *
 * Styling is headless by default. Import `@nationid/react/styles.css` to
 * pick up the optional baseline styles, or pass `className` props through to
 * adopt the host project's design system.
 */
export { DocumentInput, type DocumentInputProps } from "./components/DocumentInput.tsx";
export { useDocumentSpec } from "./hooks/useDocumentSpec.ts";
export { useDocumentValidate } from "./hooks/useDocumentValidate.ts";
