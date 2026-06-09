# @nationid/react

## 0.0.1

### Patch Changes

- 2351b4c: Add `<DocumentDisplay>` — read-only, accessible companion to `<DocumentInput>`.

  Formats a raw or already-formatted document value with the canonical mask from the `nationid` spec for the given `code`, and renders it in a small set of inline / block text containers (`span` by default; `div`, `p`, `code`, `output` via the `as` prop). When the value does not validate against the spec, the component falls back to rendering the raw value unchanged — pass a `fallback` render function to override that with a styled "invalid" state instead.

  The component pairs naturally with `<DocumentInput>`: store the user's raw value, then render it back through `<DocumentDisplay>` for read-only contexts (lists, detail pages, server-rendered summaries) without re-implementing the masking logic on the consumer side.

  ```tsx
  <dl>
    <dt>RFC</dt>
    <dd>
      <DocumentDisplay code="MX_RFC_PF" value={user.rfc} />
    </dd>
    <dt>DUI</dt>
    <dd>
      <DocumentDisplay
        code="SV_DUI"
        value={user.dui}
        fallback={(raw) => <em>Invalid DUI: {raw}</em>}
      />
    </dd>
  </dl>
  ```

  Forwards `ref` to the rendered element. Passes every standard HTML attribute (`className`, `title`, `data-*`, etc.) through.

- 4c40e58: Add `@nationid/react/rhf` — opt-in adapter for `react-hook-form` 7+.

  ```tsx
  import { useForm } from "react-hook-form";
  import { NationidController, createDocumentValidator } from "@nationid/react/rhf";

  type FormShape = { rfc: string };

  const { control, register, handleSubmit } = useForm<FormShape>({ defaultValues: { rfc: "" } });

  // Option A — drop-in Controller wired through useController. Errors set by RHF
  // (required / validate / setError) automatically drive the ARIA wiring in
  // the underlying <DocumentInput>.
  <NationidController
    name="rfc"
    control={control}
    code="MX_RFC_PF"
    locale="es"
    rules={{ required: "Requerido" }}
  />

  // Option B — keep your own input but borrow the validation function for
  // `register({ validate })`.
  <input
    {...register("rfc", {
      required: "Requerido",
      validate: createDocumentValidator("MX_RFC_PF", "es"),
    })}
  />
  ```

  - **`<NationidController>`** — Controller wrapper that wires `value` / `onChange` / `onBlur` / `ref` through `useController` and forwards `fieldState.error.message` into `<DocumentInput>`'s ARIA wiring. Externally-controlled error strings now skip the "touched" gate so form-submit errors surface immediately without forcing a blur.
  - **`createDocumentValidator(code, locale?, documentName?)`** — returns a `(value) => true | string` ready for `register({ validate })`. Empty values defer to RHF's `required` rule (no overlap, no double-error).
  - `react-hook-form` stays an **optional peer dependency** — code in `@nationid/react/rhf` is opt-in via subpath import, so consumers that do not use RHF do not get it forced on them.

  Bonus: `<DocumentInput>` itself gained a small change so externally-supplied errors no longer wait for blur — `aria-invalid` and the error alert appear the moment the host (RHF, server response, parent component) sets `errorMessage` to a non-null string.

- 462bf79: Add `<CountrySelect>` + `<DocumentTypeSelect>` and the underlying `useCountries` / `useDocumentTypes` hooks.

  Both components render a **native `<select>`** wired to `nationid/catalog`. Native `<select>` is the default because it inherits the platform's keyboard navigation, screen-reader announcements, mobile picker behaviour, and form semantics for free — no custom dropdown infra to maintain, ARIA combobox patterns to babysit, or focus-trap bugs to chase.

  ```tsx
  const [country, setCountry] = useState<CountryCode | "">("");
  const [code, setCode] = useState<DocumentTypeCode | "">("");

  return (
    <>
      <label htmlFor="country">Country</label>
      <CountrySelect
        id="country"
        value={country}
        onChange={setCountry}
        locale="es"
        placeholder="Selecciona tu país"
      />

      {country ? (
        <>
          <label htmlFor="doctype">Documento</label>
          <DocumentTypeSelect
            id="doctype"
            country={country}
            value={code}
            onChange={setCode}
            locale="es"
            purpose="personal"
            placeholder="Selecciona tu documento"
          />
        </>
      ) : null}
    </>
  );
  ```

  - `<CountrySelect>` — every country `nationid` covers, sorted by localised name. `showFlag` (default `true`) prefixes each option with the country's flag emoji. Restrict the set with `countries={["MX", "SV", "BR"]}` if you only need a subset.
  - `<DocumentTypeSelect>` — every document registered for `country`, sorted by `displayName`. Filter by `purpose="personal"` / `purpose="tax"` to drop the irrelevant set, or omit `purpose` to show both.
  - Both components are headless: pass `className` and any standard `<select>` attribute through. Both forward `ref`.
  - `useCountries(locale)` / `useDocumentTypes(country, locale, purpose?)` expose the same data for callers building their own custom dropdowns (Combobox, multiselect, virtualised list).

- 14ba84e: First publish of `@nationid/react` to npm. This is a preview release on the `0.0.x` line — the surface is small on purpose, so the package can exist in the registry while we ship the rest of the v0.1 components in subsequent patches.

  Ships in `0.0.1`:

  - **`<DocumentInput>`** — controlled, accessible, headless input that validates on blur against the `nationid` spec for a given document `code` (any of the 145+ codes across 54 countries). ARIA wiring (`aria-invalid` + `aria-describedby` + `role="alert"`) is automatic, errors clear as the user resumes typing, and `formatOnBlur` (default `true`) reformats the value with the canonical mask when valid. Forwards `ref` and the standard `<input>` attribute surface.
  - **`useDocumentSpec(code)`** — resolves the `DocumentSpec` from `nationid` or returns `null` if the code is not registered.
  - **`useDocumentValidate(code)`** — returns a memoised `{ validate, parse, format, normalize }` bundle keyed on `code`. Stable references suitable for memoised children.
  - Optional baseline stylesheet at `@nationid/react/styles.css` (`.nrx-` prefixed; low specificity so host styling overrides cleanly).

  Roadmap from `0.0.2` onward: `<DocumentDisplay>`, `<CountrySelect>` + `<DocumentTypeSelect>`, `@nationid/react/rhf` adapter for react-hook-form. Once those land and the surface is battle-tested with real consumers, we cut `0.1.0` as the first GA release.
