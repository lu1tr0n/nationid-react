---
"@nationid/react": patch
---

Add `@nationid/react/rhf` — opt-in adapter for `react-hook-form` 7+.

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
