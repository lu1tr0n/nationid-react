import type { CountryCode } from "nationid";
import type { Locale } from "nationid/catalog";
import { type ChangeEvent, forwardRef, type SelectHTMLAttributes, useCallback } from "react";

import { useCountries } from "../hooks/useCountries.ts";

/**
 * Props for {@link CountrySelect}.
 */
export interface CountrySelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  /** Selected country, or empty string for the placeholder option. */
  value: CountryCode | "";
  /** Receives the next selected `CountryCode`, or `""` if the placeholder is chosen. */
  onChange: (next: CountryCode | "") => void;
  /** Locale for the country names. Defaults to `"en"`. */
  locale?: Locale;
  /** When `true` (default), prefixes each option's name with its flag emoji. */
  showFlag?: boolean;
  /** Placeholder text rendered as the first, value-empty `<option>`. */
  placeholder?: string;
  /**
   * Restrict the options to a subset of `CountryCode`s. Order is preserved
   * if the array is explicitly passed, otherwise the full catalog is sorted
   * by localized name.
   */
  countries?: readonly CountryCode[];
}

/**
 * Native `<select>` of every country `nationid` covers. Headless by default —
 * pass `className` to adopt your design system, or wrap with your own custom
 * dropdown using {@link useCountries} for full control.
 *
 * @example
 * ```tsx
 * const [country, setCountry] = useState<CountryCode | "">("");
 * return (
 *   <label>
 *     Country
 *     <CountrySelect value={country} onChange={setCountry} locale="es" />
 *   </label>
 * );
 * ```
 */
export const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
  function CountrySelect(props, ref) {
    const {
      value,
      onChange,
      locale = "en",
      showFlag = true,
      placeholder,
      countries,
      ...selectAttrs
    } = props;

    const fullList = useCountries(locale);

    const visible = countries ? fullList.filter((c) => countries.includes(c.code)) : fullList;

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value as CountryCode | "");
      },
      [onChange],
    );

    return (
      <select {...selectAttrs} ref={ref} value={value} onChange={handleChange}>
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {visible.map((c) => (
          <option key={c.code} value={c.code}>
            {showFlag ? `${c.flag} ${c.name}` : c.name}
          </option>
        ))}
      </select>
    );
  },
);
