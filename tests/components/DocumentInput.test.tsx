import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { DocumentInput, type DocumentInputProps } from "../../src/index.ts";
import { expectNoA11yViolations } from "../axe.ts";

/**
 * Thin wrapper that keeps the input controlled, so tests can exercise both
 * the change and the blur paths without each rewriting boilerplate.
 */
function Harness(props: Omit<DocumentInputProps, "value" | "onChange">) {
  const [value, setValue] = useState("");
  return (
    <>
      <label htmlFor="harness-input">Document</label>
      <DocumentInput {...props} id="harness-input" value={value} onChange={setValue} />
    </>
  );
}

describe("DocumentInput", () => {
  it("renders a controlled text input wired through a label", () => {
    render(<Harness code="MX_RFC_PF" />);
    const input = screen.getByRole("textbox", { name: /document/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("calls onChange on every keystroke", async () => {
    const user = userEvent.setup();
    render(<Harness code="MX_RFC_PF" />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.type(input, "ABC");
    expect(input).toHaveValue("ABC");
  });

  it("surfaces no error while the user is still typing", async () => {
    const user = userEvent.setup();
    render(<Harness code="MX_RFC_PF" />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.type(input, "AB");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a localized error on blur when the value is invalid", async () => {
    const user = userEvent.setup();
    render(<Harness code="MX_RFC_PF" locale="es" />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.type(input, "INVALID-RFC");
    await user.tab();

    expect(input).toHaveAttribute("aria-invalid", "true");
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-describedby", error.id);
    // Spanish locale should be reflected in the message body.
    expect(error.textContent ?? "").not.toBe("");
  });

  it("clears the error as soon as the user resumes typing", async () => {
    const user = userEvent.setup();
    render(<Harness code="MX_RFC_PF" />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.type(input, "BAD");
    await user.tab();
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.click(input);
    await user.keyboard("x");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not flag an empty field on blur", async () => {
    const user = userEvent.setup();
    render(<Harness code="MX_RFC_PF" />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.click(input);
    await user.tab();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("invokes onValidate with the ParseResult on blur", async () => {
    const onValidate = vi.fn();
    const user = userEvent.setup();
    render(<Harness code="SV_DUI" onValidate={onValidate} />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.type(input, "012345678");
    await user.tab();

    expect(onValidate).toHaveBeenCalledTimes(1);
    const call = onValidate.mock.calls[0]?.[0];
    expect(call).toMatchObject({ code: "SV_DUI" });
    expect(typeof call.ok).toBe("boolean");
  });

  it("reformats the value with spec.format on blur when valid", async () => {
    const user = userEvent.setup();
    render(<Harness code="SV_DUI" formatOnBlur />);
    const input = screen.getByRole("textbox", { name: /document/i });
    // SV_DUI valid sample, raw form (no hyphen).
    await user.type(input, "012345678");
    await user.tab();
    // After blur it should be normalised to the canonical mask `NNNNNNNN-N`.
    expect(input).toHaveValue("01234567-8");
  });

  it("does not reformat when formatOnBlur is false", async () => {
    const user = userEvent.setup();
    render(<Harness code="SV_DUI" formatOnBlur={false} />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.type(input, "012345678");
    await user.tab();
    expect(input).toHaveValue("012345678");
  });

  it("honours an externally controlled errorMessage", async () => {
    const user = userEvent.setup();
    render(<Harness code="MX_RFC_PF" errorMessage="Server says invalid" />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.click(input);
    await user.tab();
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Server says invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards ref and standard input attributes", () => {
    const ref: { current: HTMLInputElement | null } = { current: null };
    render(
      <>
        <label htmlFor="ref-test-input">Document</label>
        <DocumentInput
          id="ref-test-input"
          code="MX_RFC_PF"
          value=""
          onChange={() => {}}
          ref={(el) => {
            ref.current = el;
          }}
          placeholder="Enter your RFC"
          autoComplete="off"
          disabled
        />
      </>,
    );
    const input = screen.getByRole("textbox", { name: /document/i });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("placeholder", "Enter your RFC");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toBeDisabled();
  });

  it("passes axe-core a11y audit in the default state", async () => {
    const { container } = render(<Harness code="MX_RFC_PF" />);
    await expectNoA11yViolations(container);
  });

  it("passes axe-core a11y audit with an error visible", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness code="MX_RFC_PF" locale="en" />);
    const input = screen.getByRole("textbox", { name: /document/i });
    await user.type(input, "BAD");
    await user.tab();
    await screen.findByRole("alert");
    await expectNoA11yViolations(container);
  });
});
