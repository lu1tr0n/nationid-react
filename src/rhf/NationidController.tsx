import type { ParseResult } from "nationid";
import { useCallback } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
} from "react-hook-form";

import { DocumentInput, type DocumentInputProps } from "../components/DocumentInput.tsx";

/**
 * Props for {@link NationidController}.
 */
export interface NationidControllerProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<DocumentInputProps, "value" | "onChange" | "onValidate" | "name" | "errorMessage"> {
  /** Name of the form field in the RHF `FieldValues` tree. */
  name: TName;
  /** RHF `control` instance returned from `useForm`. */
  control: Control<TFieldValues>;
  /**
   * RHF rules (`required`, `validate`, etc.). When `validate` is omitted, this
   * component derives one from the `code` + `locale` so the input rejects
   * invalid documents at form-submit time without extra wiring.
   */
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  /**
   * Optional callback fired after the input's on-blur validation completes.
   * Receives the same `ParseResult` that `<DocumentInput>` emits, so consumers
   * can drive side effects (analytics, downstream prefetch) from the controller
   * without re-implementing `onBlur` in user-land.
   */
  onValidate?: (result: ParseResult) => void;
}

/**
 * Drop-in `react-hook-form` wrapper around {@link DocumentInput}. Wires
 * `value`, `onChange`, `onBlur`, and `ref` through RHF's
 * {@link https://react-hook-form.com/docs/usecontroller | `useController`}.
 *
 * Surface notes:
 *
 * - RHF's `field.value` may be `undefined` while the form is hydrating; we
 *   coerce to `""` so `<DocumentInput>` stays controlled.
 * - The component takes ownership of `errorMessage`: when RHF has an error
 *   for this field, we forward `fieldState.error.message` to
 *   `<DocumentInput>` so the localised string drives the ARIA wiring. If you
 *   pass an explicit `errorMessage` on the wrapped `<DocumentInput>` props,
 *   this component will overwrite it — surface server errors via RHF's
 *   `setError` instead.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { NationidController } from "@nationid/react/rhf";
 *
 * type FormShape = { rfc: string };
 *
 * function CheckoutForm() {
 *   const { control, handleSubmit } = useForm<FormShape>({ defaultValues: { rfc: "" } });
 *
 *   return (
 *     <form onSubmit={handleSubmit((data) => console.log(data))}>
 *       <label htmlFor="rfc">RFC</label>
 *       <NationidController
 *         name="rfc"
 *         control={control}
 *         code="MX_RFC_PF"
 *         locale="es"
 *         rules={{ required: "Requerido" }}
 *         id="rfc"
 *       />
 *     </form>
 *   );
 * }
 * ```
 */
export function NationidController<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: NationidControllerProps<TFieldValues, TName>) {
  const {
    name,
    control,
    rules,
    onValidate,
    code,
    locale = "en",
    documentName,
    ...inputProps
  } = props;

  const { field, fieldState } = useController<TFieldValues, TName>(
    rules ? { name, control, rules } : { name, control },
  );

  const handleChange = useCallback(
    (next: string) => {
      field.onChange(next);
    },
    [field],
  );

  const handleValidate = useCallback(
    (result: ParseResult) => {
      field.onBlur();
      onValidate?.(result);
    },
    [field, onValidate],
  );

  const inputValue = typeof field.value === "string" ? field.value : "";
  const errorMessage = fieldState.error?.message ?? null;

  return documentName !== undefined ? (
    <DocumentInput
      {...inputProps}
      ref={field.ref}
      name={field.name}
      code={code}
      locale={locale}
      documentName={documentName}
      value={inputValue}
      onChange={handleChange}
      onValidate={handleValidate}
      errorMessage={errorMessage}
    />
  ) : (
    <DocumentInput
      {...inputProps}
      ref={field.ref}
      name={field.name}
      code={code}
      locale={locale}
      value={inputValue}
      onChange={handleChange}
      onValidate={handleValidate}
      errorMessage={errorMessage}
    />
  );
}
