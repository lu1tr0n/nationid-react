import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type SubmitHandler, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { NationidController } from "../../src/rhf/index.ts";
import { expectNoA11yViolations } from "../axe.ts";

type FormShape = { rfc: string };

type Rules = NonNullable<Parameters<typeof NationidController<FormShape, "rfc">>[0]["rules"]>;

function Harness(props: {
  defaultValues?: Partial<FormShape>;
  onSubmit?: SubmitHandler<FormShape>;
  rules?: Rules;
}) {
  const { control, handleSubmit, formState } = useForm<FormShape>({
    defaultValues: { rfc: "", ...props.defaultValues },
  });
  return (
    <form onSubmit={handleSubmit(props.onSubmit ?? (() => {}))} noValidate>
      <label htmlFor="rfc">RFC</label>
      {props.rules !== undefined ? (
        <NationidController
          name="rfc"
          control={control}
          code="MX_RFC_PF"
          locale="en"
          id="rfc"
          rules={props.rules}
        />
      ) : (
        <NationidController name="rfc" control={control} code="MX_RFC_PF" locale="en" id="rfc" />
      )}
      <button type="submit">Submit</button>
      <output data-testid="dirty">{formState.isDirty ? "dirty" : "clean"}</output>
    </form>
  );
}

describe("NationidController", () => {
  it("renders the underlying input wired to RHF", () => {
    render(<Harness />);
    const input = screen.getByRole("textbox", { name: /rfc/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("propagates user input back to the RHF form state", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} defaultValues={{ rfc: "" }} />);
    const input = screen.getByRole("textbox", { name: /rfc/i });
    await user.type(input, "LOMA940131K56");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({ rfc: "LOMA940131K56" });
  });

  it("surfaces RHF validation errors through the DocumentInput's ARIA wiring", async () => {
    const user = userEvent.setup();
    render(<Harness rules={{ required: "RFC is required" }} onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /submit/i }));
    const input = screen.getByRole("textbox", { name: /rfc/i });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(await screen.findByRole("alert")).toHaveTextContent("RFC is required");
  });

  it("marks the field as dirty after the first edit", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByTestId("dirty")).toHaveTextContent("clean");
    await user.type(screen.getByRole("textbox", { name: /rfc/i }), "X");
    expect(screen.getByTestId("dirty")).toHaveTextContent("dirty");
  });

  it("hydrates from defaultValues", () => {
    render(<Harness defaultValues={{ rfc: "ABC" }} />);
    expect(screen.getByRole("textbox", { name: /rfc/i })).toHaveValue("ABC");
  });

  it("passes axe-core a11y audit", async () => {
    const { container } = render(<Harness />);
    await expectNoA11yViolations(container);
  });
});
