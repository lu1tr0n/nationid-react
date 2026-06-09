import type { DocumentTypeCode, ParseResult } from "nationid";
import { getErrorMessage, type Locale } from "nationid/i18n";
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  useCallback,
  useId,
  useState,
} from "react";

import { useDocumentValidate } from "../hooks/useDocumentValidate.ts";

/**
 * Props for {@link DocumentInput}.
 *
 * Inherits every standard `<input>` attribute except the ones that the
 * component controls (`type`, `value`, `onChange`, `onBlur`, `aria-invalid`,
 * `aria-describedby`).
 */
export interface DocumentInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange" | "onBlur" | "aria-invalid" | "aria-describedby"
  > {
  /** Document type code from `nationid` (e.g. `"MX_RFC"`, `"SV_DUI"`). */
  code: DocumentTypeCode;
  /** Controlled value — the raw string the user typed. */
  value: string;
  /** Raw change handler. Receives the next raw input value. */
  onChange: (next: string) => void;
  /** Optional blur handler. Receives a `ParseResult` so the consumer can persist normalised/formatted forms. */
  onValidate?: (result: ParseResult) => void;
  /** Locale for error messages. Defaults to `"en"`. */
  locale?: Locale;
  /** When `true` (default), reformats the field with `spec.format()` on blur when valid. */
  formatOnBlur?: boolean;
  /** Override for the `{document}` placeholder in localised error messages. Defaults to the document `code`. */
  documentName?: string;
  /** Manual error string — when provided, takes precedence over the auto-derived one. Pass `null` to clear an external error. */
  errorMessage?: string | null;
  /** className applied to the rendered `<input>`. */
  className?: string;
  /** className applied to the error `<span>` (only rendered when an error is shown). */
  errorClassName?: string;
}

/**
 * Controlled, accessible input for a single national document. Validates the
 * value on blur against the `nationid` spec for `code` and surfaces the error
 * through ARIA wiring (`aria-invalid` + `aria-describedby` + `role="alert"`).
 *
 * The component is headless — pass `className` props through to adopt your
 * design system, or import `@nationid/react/styles.css` for baseline visuals.
 *
 * @example Vanilla controlled
 * ```tsx
 * const [value, setValue] = useState("");
 * return (
 *   <label>
 *     RFC
 *     <DocumentInput
 *       code="MX_RFC"
 *       value={value}
 *       onChange={setValue}
 *       locale="es"
 *     />
 *   </label>
 * );
 * ```
 */
export const DocumentInput = forwardRef<HTMLInputElement, DocumentInputProps>(
  function DocumentInput(props, ref) {
    const {
      code,
      value,
      onChange,
      onValidate,
      locale = "en",
      formatOnBlur = true,
      documentName,
      errorMessage,
      className,
      errorClassName,
      id,
      onFocus,
      ...inputAttrs
    } = props;

    const reactId = useId();
    const inputId = id ?? `${reactId}-input`;
    const errorId = `${reactId}-error`;

    const { parse } = useDocumentValidate(code);
    const [touched, setTouched] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    // External errorMessage wins; otherwise we surface our own (set on blur,
    // cleared on next edit so we do not nag while the user is still typing).
    const visibleError = errorMessage !== undefined ? errorMessage : internalError;
    const isInvalid = touched && Boolean(visibleError);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (internalError) {
          setInternalError(null);
        }
        onChange(event.target.value);
      },
      [internalError, onChange],
    );

    const handleBlur = useCallback(() => {
      setTouched(true);

      const trimmed = value.trim();
      if (trimmed === "") {
        // Empty fields are not a validation error per se — leave the prior
        // state untouched and let the consumer's `required` attribute handle
        // empty-submit semantics via the platform.
        setInternalError(null);
        return;
      }

      const result = parse(trimmed);
      if (result.ok) {
        setInternalError(null);
        if (formatOnBlur && result.formatted !== value) {
          onChange(result.formatted);
        }
      } else {
        setInternalError(getErrorMessage(result.reason, locale, documentName ?? code));
      }

      onValidate?.(result);
    }, [code, documentName, formatOnBlur, locale, onChange, onValidate, parse, value]);

    return (
      <>
        <input
          {...inputAttrs}
          ref={ref}
          id={inputId}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={onFocus}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? errorId : undefined}
          className={className}
        />
        {isInvalid && visibleError ? (
          <span id={errorId} role="alert" aria-live="polite" className={errorClassName}>
            {visibleError}
          </span>
        ) : null}
      </>
    );
  },
);
