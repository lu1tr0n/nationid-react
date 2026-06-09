---
"@nationid/react": patch
---

Add `<DocumentDisplay>` — read-only, accessible companion to `<DocumentInput>`.

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
