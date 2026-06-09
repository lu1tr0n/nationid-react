import type { DocumentTypeCode, ParseResult } from "nationid";
import { format, normalize, parse, validate } from "nationid";
import { useCallback, useMemo } from "react";

/**
 * Stable validator bundle for a single document `code`. The returned
 * functions are memoized on the `code`, so passing them down to memoized
 * children is safe.
 *
 * @example
 * ```tsx
 * const { parse, validate } = useDocumentValidate("MX_RFC");
 * const result = parse(rawInput);
 * ```
 */
export function useDocumentValidate<C extends DocumentTypeCode>(code: C) {
  const validateFn = useCallback((input: string): boolean => validate(code, input), [code]);
  const parseFn = useCallback((input: string): ParseResult<C> => parse(code, input), [code]);
  const formatFn = useCallback((input: string): string => format(code, input), [code]);
  const normalizeFn = useCallback((input: string): string => normalize(code, input), [code]);

  return useMemo(
    () => ({
      validate: validateFn,
      parse: parseFn,
      format: formatFn,
      normalize: normalizeFn,
    }),
    [validateFn, parseFn, formatFn, normalizeFn],
  );
}
