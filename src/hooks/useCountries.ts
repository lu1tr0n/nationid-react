import type { CountryInfo, Locale } from "nationid/catalog";
import { listCountries } from "nationid/catalog";
import { useMemo } from "react";

/**
 * Localised list of every country `nationid` knows about, sorted by
 * `CountryInfo.name`. Memoised on `locale` so the array reference is
 * stable across renders and safe to pass to memoised children.
 *
 * @example
 * ```tsx
 * const countries = useCountries("es");
 * return (
 *   <ul>
 *     {countries.map((c) => (
 *       <li key={c.code}>{c.flag} {c.name}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export function useCountries(locale: Locale = "en"): readonly CountryInfo[] {
  return useMemo(() => {
    const list = listCountries(locale).slice();
    list.sort((a, b) => a.name.localeCompare(b.name, locale));
    return list;
  }, [locale]);
}
