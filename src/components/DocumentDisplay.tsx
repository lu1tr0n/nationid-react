import type { DocumentTypeCode } from "nationid";
import { format, validate } from "nationid";
import { forwardRef, type HTMLAttributes, type ReactNode, useMemo } from "react";

/**
 * Tag names supported by {@link DocumentDisplay}'s `as` prop.
 *
 * Restricted to a small set of inline / block text containers so the
 * component does not promise to render an arbitrary HTML element — keeping
 * the ref and attribute surface predictable.
 */
export type DocumentDisplayTag = "span" | "div" | "p" | "code" | "output";

/**
 * Props for {@link DocumentDisplay}.
 */
export interface DocumentDisplayProps extends HTMLAttributes<HTMLElement> {
  /** Document type code from `nationid` (e.g. `"MX_RFC_PF"`, `"SV_DUI"`). */
  code: DocumentTypeCode;
  /**
   * Raw or formatted document value. The component normalises with
   * `spec.format()` before rendering, so both `"012345678"` and
   * `"01234567-8"` produce the same output for `SV_DUI`.
   */
  value: string;
  /**
   * Rendered when `value` does not validate against the spec. Receives the
   * original raw `value` so the consumer can render a styled placeholder
   * or the raw string. Defaults to rendering the raw `value` unchanged.
   */
  fallback?: (raw: string) => ReactNode;
  /**
   * HTML tag to render. Defaults to `"span"` so the component composes
   * inline. Pass `"div"`, `"p"`, `"code"`, or `"output"` for block /
   * semantic contexts.
   */
  as?: DocumentDisplayTag;
}

/**
 * Read-only, accessible display of a national document. Formats `value`
 * with the `nationid` spec for `code` and renders the canonical form.
 *
 * When `value` does not validate (wrong length, bad checksum, malformed),
 * the component renders the raw `value` unchanged. Pass a `fallback`
 * render function to override that with a styled "invalid" state.
 *
 * Pairs naturally with `<DocumentInput>`: store the user's raw value, then
 * render it back through `<DocumentDisplay>` for read-only contexts
 * (lists, detail pages, server-rendered summaries).
 *
 * @example
 * ```tsx
 * <dl>
 *   <dt>RFC</dt>
 *   <dd>
 *     <DocumentDisplay code="MX_RFC_PF" value={user.rfc} />
 *   </dd>
 * </dl>
 * ```
 *
 * @example With an invalid-state fallback
 * ```tsx
 * <DocumentDisplay
 *   code="SV_DUI"
 *   value={duiFromBackend}
 *   fallback={(raw) => <em>Invalid DUI: {raw}</em>}
 * />
 * ```
 */
export const DocumentDisplay = forwardRef<HTMLElement, DocumentDisplayProps>(
  function DocumentDisplay(props, ref) {
    const { code, value, fallback, as = "span", ...rest } = props;

    const { isValid, formatted } = useMemo(
      () => ({ isValid: validate(code, value), formatted: format(code, value) }),
      [code, value],
    );

    const Tag = as as "span";

    if (!isValid && fallback) {
      return (
        <Tag ref={ref as React.Ref<HTMLSpanElement>} {...rest}>
          {fallback(value)}
        </Tag>
      );
    }

    return (
      <Tag ref={ref as React.Ref<HTMLSpanElement>} {...rest}>
        {formatted}
      </Tag>
    );
  },
);
