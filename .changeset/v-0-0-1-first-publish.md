---
"@nationid/react": patch
---

First publish of `@nationid/react` to npm. This is a preview release on the `0.0.x` line — the surface is small on purpose, so the package can exist in the registry while we ship the rest of the v0.1 components in subsequent patches.

Ships in `0.0.1`:

- **`<DocumentInput>`** — controlled, accessible, headless input that validates on blur against the `nationid` spec for a given document `code` (any of the 145+ codes across 54 countries). ARIA wiring (`aria-invalid` + `aria-describedby` + `role="alert"`) is automatic, errors clear as the user resumes typing, and `formatOnBlur` (default `true`) reformats the value with the canonical mask when valid. Forwards `ref` and the standard `<input>` attribute surface.
- **`useDocumentSpec(code)`** — resolves the `DocumentSpec` from `nationid` or returns `null` if the code is not registered.
- **`useDocumentValidate(code)`** — returns a memoised `{ validate, parse, format, normalize }` bundle keyed on `code`. Stable references suitable for memoised children.
- Optional baseline stylesheet at `@nationid/react/styles.css` (`.nrx-` prefixed; low specificity so host styling overrides cleanly).

Roadmap from `0.0.2` onward: `<DocumentDisplay>`, `<CountrySelect>` + `<DocumentTypeSelect>`, `@nationid/react/rhf` adapter for react-hook-form. Once those land and the surface is battle-tested with real consumers, we cut `0.1.0` as the first GA release.
