import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocumentDisplay } from "../../src/index.ts";
import { expectNoA11yViolations } from "../axe.ts";

describe("DocumentDisplay", () => {
  it("renders the canonical formatted value when given a raw value", () => {
    const { container } = render(<DocumentDisplay code="SV_DUI" value="012345678" />);
    expect(container.firstChild?.textContent).toBe("01234567-8");
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  it("renders the canonical formatted value when given an already-formatted value", () => {
    const { container } = render(<DocumentDisplay code="SV_DUI" value="01234567-8" />);
    expect(container.firstChild?.textContent).toBe("01234567-8");
  });

  it("renders the raw value unchanged when no fallback is provided and the value is invalid", () => {
    const { container } = render(<DocumentDisplay code="SV_DUI" value="not-a-dui" />);
    expect(container.firstChild?.textContent).toBe("not-a-dui");
  });

  it("renders the fallback when the value does not validate and a fallback is given", () => {
    const { container } = render(
      <DocumentDisplay
        code="SV_DUI"
        value="not-a-dui"
        fallback={(raw) => <em data-testid="invalid">Invalid: {raw}</em>}
      />,
    );
    const placeholder = screen.getByTestId("invalid");
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent("Invalid: not-a-dui");
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  it("does NOT use the fallback when the value is valid", () => {
    render(
      <DocumentDisplay
        code="SV_DUI"
        value="012345678"
        fallback={(raw) => <em data-testid="invalid">Invalid: {raw}</em>}
      />,
    );
    expect(screen.queryByTestId("invalid")).not.toBeInTheDocument();
  });

  it("respects the `as` prop and renders the chosen tag", () => {
    const { container } = render(<DocumentDisplay code="SV_DUI" value="012345678" as="code" />);
    expect(container.firstChild?.nodeName).toBe("CODE");
    expect(container.firstChild?.textContent).toBe("01234567-8");
  });

  it("passes standard HTML attributes through to the rendered element", () => {
    const { container } = render(
      <DocumentDisplay
        code="SV_DUI"
        value="012345678"
        className="custom"
        data-testid="display"
        title="Salvadoran DUI"
      />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toBe("custom");
    expect(root.getAttribute("data-testid")).toBe("display");
    expect(root.getAttribute("title")).toBe("Salvadoran DUI");
  });

  it("forwards ref to the underlying element", () => {
    const ref: { current: HTMLElement | null } = { current: null };
    render(
      <DocumentDisplay
        code="SV_DUI"
        value="012345678"
        ref={(el) => {
          ref.current = el;
        }}
      />,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nodeName).toBe("SPAN");
    expect(ref.current?.textContent).toBe("01234567-8");
  });

  it("re-formats when the value prop changes", () => {
    const { rerender, container } = render(<DocumentDisplay code="SV_DUI" value="012345678" />);
    expect(container.firstChild?.textContent).toBe("01234567-8");
    rerender(<DocumentDisplay code="MX_RFC_PF" value="LOMA940131K56" />);
    expect(container.firstChild?.textContent).toBe("LOMA940131K56");
  });

  it("passes axe-core a11y audit", async () => {
    const { container } = render(<DocumentDisplay code="SV_DUI" value="012345678" />);
    await expectNoA11yViolations(container);
  });
});
