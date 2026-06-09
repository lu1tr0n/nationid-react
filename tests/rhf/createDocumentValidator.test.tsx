import { describe, expect, it } from "vitest";

import { createDocumentValidator } from "../../src/rhf/index.ts";

describe("createDocumentValidator", () => {
  it("returns true for an empty string (defers to `required` rule)", () => {
    const validate = createDocumentValidator("MX_RFC_PF", "en");
    expect(validate("")).toBe(true);
    expect(validate("   ")).toBe(true);
  });

  it("returns true for a valid value", () => {
    const validate = createDocumentValidator("SV_DUI", "en");
    expect(validate("012345678")).toBe(true);
    expect(validate("01234567-8")).toBe(true);
  });

  it("returns the localised error message for an invalid value", () => {
    const validate = createDocumentValidator("SV_DUI", "en");
    const result = validate("not-a-dui");
    expect(typeof result).toBe("string");
    expect(result).not.toBe("");
  });

  it("localises the error message via the `locale` argument", () => {
    const en = createDocumentValidator("SV_DUI", "en")("not-a-dui");
    const es = createDocumentValidator("SV_DUI", "es")("not-a-dui");
    expect(typeof en).toBe("string");
    expect(typeof es).toBe("string");
    expect(en).not.toBe(es);
  });

  it("threads `documentName` into the interpolated error message", () => {
    const withDefault = createDocumentValidator("SV_DUI", "en")("not-a-dui") as string;
    const withCustom = createDocumentValidator(
      "SV_DUI",
      "en",
      "Salvadoran DUI",
    )("not-a-dui") as string;
    expect(withCustom).not.toBe(withDefault);
    expect(withCustom).toContain("Salvadoran DUI");
  });

  it("treats non-string inputs as valid (RHF defensive)", () => {
    const validate = createDocumentValidator("MX_RFC_PF", "en");
    expect(validate(undefined as unknown as string)).toBe(true);
    expect(validate(null as unknown as string)).toBe(true);
    expect(validate(123 as unknown as string)).toBe(true);
  });
});
