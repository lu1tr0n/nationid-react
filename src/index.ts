/**
 * `@nationid/react` — React components and hooks built on top of the
 * framework-agnostic `nationid` validator.
 *
 * v0.1 ships:
 *  - {@link DocumentInput} — controlled, accessible input that validates on
 *    blur and surfaces the error through ARIA wiring.
 *  - {@link DocumentDisplay} — read-only, accessible display that formats
 *    the value with the canonical mask.
 *  - {@link CountrySelect} / {@link DocumentTypeSelect} — native, accessible
 *    `<select>`s wired to the `nationid/catalog`.
 *  - {@link useDocumentSpec} / {@link useDocumentValidate} /
 *    {@link useCountries} / {@link useDocumentTypes} — hooks for callers
 *    that want to drive their own UI.
 *
 * Styling is headless by default. Import `@nationid/react/styles.css` to
 * pick up the optional baseline styles, or pass `className` props through to
 * adopt the host project's design system.
 */
export { CountrySelect, type CountrySelectProps } from "./components/CountrySelect.tsx";
export {
  DocumentDisplay,
  type DocumentDisplayProps,
  type DocumentDisplayTag,
} from "./components/DocumentDisplay.tsx";
export { DocumentInput, type DocumentInputProps } from "./components/DocumentInput.tsx";
export {
  DocumentTypeSelect,
  type DocumentTypeSelectProps,
} from "./components/DocumentTypeSelect.tsx";
export { useCountries } from "./hooks/useCountries.ts";
export { useDocumentSpec } from "./hooks/useDocumentSpec.ts";
export { useDocumentTypes } from "./hooks/useDocumentTypes.ts";
export { useDocumentValidate } from "./hooks/useDocumentValidate.ts";
