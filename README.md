# @nationid/react

> React components and hooks for [`nationid`](https://www.npmjs.com/package/nationid) — typed validators for national identity and tax documents across 54 countries.

[![npm](https://img.shields.io/npm/v/@nationid/react.svg?style=flat-square)](https://www.npmjs.com/package/@nationid/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![CI](https://github.com/lu1tr0n/nationid-react/actions/workflows/ci.yml/badge.svg)](https://github.com/lu1tr0n/nationid-react/actions/workflows/ci.yml)

> **Status: pre-release.** v0.1 ships LATAM-8 (SV, MX, CO, BR, AR, CL, PE, GT). Track the roadmap below.

## Why

[`nationid`](https://github.com/lu1tr0n/nationid) covers the validation logic. `@nationid/react` covers the UI: accessible inputs, formatted displays, and hooks that integrate cleanly with controlled forms or with `react-hook-form`. Zero opinions on styling — drop in the optional baseline stylesheet, or wire your own design system through `className`.

## Install

```bash
pnpm add @nationid/react nationid react react-dom
```

`react-hook-form` is an optional peer for the `@nationid/react/rhf` adapter.

## Quick start

```tsx
import { DocumentInput } from "@nationid/react";
import "@nationid/react/styles.css"; // optional baseline styles

export function CheckoutForm() {
  const [rfc, setRfc] = useState("");
  return (
    <label>
      RFC
      <DocumentInput
        country="MX"
        code="MX_RFC"
        value={rfc}
        onChange={setRfc}
      />
    </label>
  );
}
```

## With `react-hook-form`

```tsx
import { useForm } from "react-hook-form";
import { NationidController } from "@nationid/react/rhf";

const { control } = useForm();

<NationidController
  name="rfc"
  control={control}
  country="MX"
  code="MX_RFC"
/>;
```

## Roadmap

- **v0.1** — `<DocumentInput>`, `<DocumentDisplay>`, `<CountrySelect>`, `<DocumentTypeSelect>`, hooks, RHF adapter. LATAM-8 (SV, MX, CO, BR, AR, CL, PE, GT).
- **v0.2** — 12 EU countries (DE, FR, ES, IT, PT, NL, BE, CH, GB, PL, DK, SE).
- **v0.3** — `<DocumentScanner>` (OCR via tesseract.js for DUI / INE / CURP cards).
- **v0.4** — Asia (JP, KR, SG, IN, TW).
- **v1.0** — Full parity with `nationid` (all 54 countries) + stable API.

## License

MIT — see [LICENSE](./LICENSE).
