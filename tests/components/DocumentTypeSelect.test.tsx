import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { DocumentTypeSelect, type DocumentTypeSelectProps } from "../../src/index.ts";
import { expectNoA11yViolations } from "../axe.ts";

function Harness(props: Omit<DocumentTypeSelectProps, "value" | "onChange">) {
  const [value, setValue] = useState<DocumentTypeSelectProps["value"]>("");
  return (
    <>
      <label htmlFor="doctype">Document type</label>
      <DocumentTypeSelect {...props} id="doctype" value={value} onChange={setValue} />
    </>
  );
}

describe("DocumentTypeSelect", () => {
  it("renders a labelled <select>", () => {
    render(<Harness country="MX" />);
    const select = screen.getByRole("combobox", { name: /document type/i });
    expect(select.tagName).toBe("SELECT");
  });

  it("renders every registered document type for the given country", () => {
    render(<Harness country="MX" locale="en" />);
    expect(screen.getByRole("option", { name: /CURP/i })).toBeInTheDocument();
    expect(screen.getAllByRole("option", { name: /RFC/i }).length).toBeGreaterThan(0);
  });

  it("filters by `purpose` when provided", () => {
    render(<Harness country="MX" locale="en" purpose="tax" />);
    // RFC variants are tax docs and must appear.
    expect(screen.getAllByRole("option", { name: /RFC/i }).length).toBeGreaterThan(0);
    // CURP is personal-scope only, so it must NOT appear under purpose="tax".
    expect(screen.queryByRole("option", { name: /^CURP$/i })).not.toBeInTheDocument();
  });

  it("renders a placeholder option when provided", () => {
    render(<Harness country="MX" placeholder="Choose document type" />);
    expect(screen.getByRole("option", { name: "Choose document type" })).toBeInTheDocument();
  });

  it("emits the selected DocumentTypeCode on change", async () => {
    const user = userEvent.setup();
    render(<Harness country="MX" locale="en" />);
    const select = screen.getByRole("combobox", { name: /document type/i }) as HTMLSelectElement;
    await user.selectOptions(select, "MX_CURP");
    expect(select.value).toBe("MX_CURP");
  });

  it("re-derives the option list when `country` changes", () => {
    const { rerender } = render(<Harness country="MX" locale="en" />);
    expect(screen.getByRole("option", { name: /CURP/i })).toBeInTheDocument();
    rerender(<Harness country="SV" locale="en" />);
    expect(screen.queryByRole("option", { name: /CURP/i })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: /DUI/i })).toBeInTheDocument();
  });

  it("passes axe-core a11y audit", async () => {
    const { container } = render(<Harness country="MX" placeholder="Choose document type" />);
    await expectNoA11yViolations(container);
  });
});
