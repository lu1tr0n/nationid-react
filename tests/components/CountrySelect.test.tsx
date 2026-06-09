import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { CountrySelect, type CountrySelectProps } from "../../src/index.ts";
import { expectNoA11yViolations } from "../axe.ts";

function Harness(props: Omit<CountrySelectProps, "value" | "onChange">) {
  const [value, setValue] = useState<CountrySelectProps["value"]>("");
  return (
    <>
      <label htmlFor="country">Country</label>
      <CountrySelect {...props} id="country" value={value} onChange={setValue} />
    </>
  );
}

describe("CountrySelect", () => {
  it("renders a labelled <select>", () => {
    render(<Harness />);
    const select = screen.getByRole("combobox", { name: /country/i });
    expect(select.tagName).toBe("SELECT");
  });

  it("renders every country with the flag prefix by default", () => {
    render(<Harness locale="en" />);
    const mxOption = screen.getByRole("option", { name: /🇲🇽\s+Mexico/i });
    expect(mxOption).toBeInTheDocument();
  });

  it("omits the flag prefix when showFlag is false", () => {
    render(<Harness locale="en" showFlag={false} />);
    expect(screen.getByRole("option", { name: "Mexico" })).toBeInTheDocument();
  });

  it("renders a placeholder option when provided", () => {
    render(<Harness placeholder="Select your country" />);
    expect(screen.getByRole("option", { name: "Select your country" })).toBeInTheDocument();
  });

  it("emits the selected CountryCode on change", async () => {
    const user = userEvent.setup();
    render(<Harness locale="en" />);
    const select = screen.getByRole("combobox", { name: /country/i }) as HTMLSelectElement;
    await user.selectOptions(select, "MX");
    expect(select.value).toBe("MX");
  });

  it("restricts the option list to the `countries` prop when given", () => {
    render(<Harness locale="en" countries={["MX", "SV"]} />);
    expect(screen.getByRole("option", { name: /🇲🇽\s+Mexico/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /🇸🇻\s+El Salvador/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Brazil/i })).not.toBeInTheDocument();
  });

  it("localises country names through the `locale` prop", () => {
    render(<Harness locale="es" />);
    expect(screen.getByRole("option", { name: /🇲🇽\s+México/i })).toBeInTheDocument();
  });

  it("passes axe-core a11y audit", async () => {
    const { container } = render(<Harness placeholder="Select your country" />);
    await expectNoA11yViolations(container);
  });
});
