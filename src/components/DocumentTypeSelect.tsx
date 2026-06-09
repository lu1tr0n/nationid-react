import type { CountryCode, DocumentTypeCode } from "nationid";
import type { DocumentPurpose, Locale } from "nationid/catalog";
import { type ChangeEvent, forwardRef, type SelectHTMLAttributes, useCallback } from "react";

import { useDocumentTypes } from "../hooks/useDocumentTypes.ts";

/**
 * Props for {@link DocumentTypeSelect}.
 */
export interface DocumentTypeSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  /** Country whose document types should be listed. */
  country: CountryCode;
  /** Selected document type, or empty string for the placeholder option. */
  value: DocumentTypeCode | "";
  /** Receives the next selected `DocumentTypeCode`, or `""` if the placeholder is chosen. */
  onChange: (next: DocumentTypeCode | "") => void;
  /** Locale for the document names. Defaults to `"en"`. */
  locale?: Locale;
  /** Filter the options by purpose (`"personal"` or `"tax"`). Defaults to no filter. */
  purpose?: DocumentPurpose;
  /** Placeholder text rendered as the first, value-empty `<option>`. */
  placeholder?: string;
}

/**
 * Native `<select>` of every document type registered for the given `country`,
 * optionally filtered by `purpose`. Headless by default — pass `className` to
 * adopt your design system, or wrap with your own custom dropdown using
 * {@link useDocumentTypes} for full control.
 *
 * @example
 * ```tsx
 * const [country, setCountry] = useState<CountryCode | "">("MX");
 * const [code, setCode] = useState<DocumentTypeCode | "">("");
 * return (
 *   <>
 *     <CountrySelect value={country} onChange={setCountry} locale="es" />
 *     {country ? (
 *       <DocumentTypeSelect
 *         country={country}
 *         value={code}
 *         onChange={setCode}
 *         locale="es"
 *         purpose="personal"
 *       />
 *     ) : null}
 *   </>
 * );
 * ```
 */
export const DocumentTypeSelect = forwardRef<HTMLSelectElement, DocumentTypeSelectProps>(
  function DocumentTypeSelect(props, ref) {
    const { country, value, onChange, locale = "en", purpose, placeholder, ...selectAttrs } = props;

    const docs = useDocumentTypes(country, locale, purpose);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value as DocumentTypeCode | "");
      },
      [onChange],
    );

    return (
      <select {...selectAttrs} ref={ref} value={value} onChange={handleChange}>
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {docs.map((d) => (
          <option key={d.code} value={d.code}>
            {d.displayName}
          </option>
        ))}
      </select>
    );
  },
);
