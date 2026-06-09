import type { DocumentSpec, DocumentTypeCode } from "nationid";
import { getSpec } from "nationid";
import { useMemo } from "react";

/**
 * Resolve the `DocumentSpec` for a given `code`. Returns `null` when the code
 * is not registered (the underlying `getSpec` throws; we trap and translate
 * that to `null` so consumers can render a fallback without try/catch in
 * component code).
 *
 * @example
 * ```tsx
 * const spec = useDocumentSpec("MX_RFC");
 * if (!spec) return <Fallback />;
 * return <input maxLength={spec.mask.length} />;
 * ```
 */
export function useDocumentSpec<C extends DocumentTypeCode>(code: C): DocumentSpec<C> | null {
  return useMemo(() => {
    try {
      return getSpec(code);
    } catch {
      return null;
    }
  }, [code]);
}
