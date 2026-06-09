/**
 * `@nationid/react/rhf` — opt-in adapters for `react-hook-form` 7+.
 *
 * Ships two surfaces:
 *
 * - {@link NationidController} — a Controller-style wrapper around
 *   {@link DocumentInput} that wires `value` / `onChange` / `onBlur` / `ref`
 *   through `useController` and forwards `fieldState.error.message` into the
 *   input's ARIA wiring automatically.
 * - {@link createDocumentValidator} — a `validate` function compatible with
 *   `register("...", { validate: ... })`. Useful when you do not want a
 *   controller but still want `nationid` to gate form submission.
 *
 * `react-hook-form` is an optional peer dependency. Importing this subpath
 * without it installed throws at module-load time.
 */
export { createDocumentValidator } from "./createDocumentValidator.ts";
export {
  NationidController,
  type NationidControllerProps,
} from "./NationidController.tsx";
