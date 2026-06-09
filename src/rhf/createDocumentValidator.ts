import type { DocumentTypeCode } from "nationid";
import { parse } from "nationid";
import { getErrorMessage, type Locale } from "nationid/i18n";

/**
 * Build a `validate` function compatible with `react-hook-form`'s
 * {@link https://react-hook-form.com/docs/useform/register | `register`}
 * API. Returns `true` when the value is valid (or empty), or the localised
 * error message string when it is not — exactly what RHF wants.
 *
 * Empty values are treated as valid because RHF's `required` rule already
 * owns "empty" semantics. Let the consumer compose: `required` for empty,
 * this validator for content shape.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { createDocumentValidator } from "@nationid/react/rhf";
 *
 * const { register } = useForm<{ rfc: string }>();
 *
 * <input
 *   {...register("rfc", {
 *     required: "Required",
 *     validate: createDocumentValidator("MX_RFC_PF", "es"),
 *   })}
 * />
 * ```
 */
export function createDocumentValidator(
  code: DocumentTypeCode,
  locale: Locale = "en",
  documentName?: string,
): (value: string) => true | string {
  return (value: string) => {
    if (typeof value !== "string" || value.trim() === "") return true;
    const result = parse(code, value.trim());
    if (result.ok) return true;
    return getErrorMessage(result.reason, locale, documentName ?? code);
  };
}
