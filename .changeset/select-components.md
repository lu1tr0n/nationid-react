---
"@nationid/react": patch
---

Add `<CountrySelect>` + `<DocumentTypeSelect>` and the underlying `useCountries` / `useDocumentTypes` hooks.

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
