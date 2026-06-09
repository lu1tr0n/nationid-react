import type { CountryCode } from "nationid";
import type { DocumentInfo, DocumentPurpose, Locale } from "nationid/catalog";
import { listDocuments } from "nationid/catalog";
import { useMemo } from "react";

/**
 * Localised list of every document type registered for `country`, sorted
 * by `DocumentInfo.displayName`. Pass `purpose` to filter the results
 * (e.g. `"personal"` to drop tax-only documents from a citizenship form).
 *
 * Memoised on `(country, locale, purpose)` so the array reference is
 * stable across renders.
 *
 * @example
 * ```tsx
 * const docs = useDocumentTypes("MX", "es", "personal");
 * return (
 *   <select>
 *     {docs.map((d) => (
 *       <option key={d.code} value={d.code}>{d.displayName}</option>
 *     ))}
 *   </select>
 * );
 * ```
 */
export function useDocumentTypes(
  country: CountryCode,
  locale: Locale = "en",
  purpose?: DocumentPurpose,
): readonly DocumentInfo[] {
  return useMemo(() => {
    const list = listDocuments(country, locale).slice();
    const filtered = purpose ? list.filter((d) => d.purpose === purpose) : list;
    filtered.sort((a, b) => a.displayName.localeCompare(b.displayName, locale));
    return filtered;
  }, [country, locale, purpose]);
}
