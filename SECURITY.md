# Security Policy

`@nationid/react` is the React UI layer on top of [`nationid`](https://github.com/lu1tr0n/nationid). It ships hooks and components that consume validation logic from the core library, plus their own rendering, state and accessibility surface.

If you find a security issue in either the core or the React layer, please report it privately. **Do not open a public GitHub issue.**

## Reporting a vulnerability

### Preferred channel

Open a [GitHub Security Advisory](https://github.com/lu1tr0n/nationid-react/security/advisories/new). This creates a private discussion where we can coordinate the fix and the disclosure together.

For issues that affect the underlying validation algorithms rather than the React surface, please use the [`nationid` advisory channel](https://github.com/lu1tr0n/nationid/security/advisories/new) so the fix lands at the right layer.

### Alternative channel

If you cannot use GitHub Security Advisories, email **luis.navarro.alvarez.1991@gmail.com** with the subject prefix `[nationid-react security]`.

### What to include

- Affected package version(s) (`@nationid/react@x.y.z`) and, if relevant, the underlying `nationid` version
- React version and rendering environment (CSR, SSR, RSC, React Native)
- A clear description of the issue
- A minimal reproduction or proof of concept (CodeSandbox / StackBlitz / repo link preferred)
- Impact assessment (what an attacker could achieve)
- Any suggested mitigation

We acknowledge reports within **3 business days** and aim to give an initial assessment within **7 business days**, in line with common coordinated-disclosure practice (CERT/CC, GitHub Security Advisories).

## Supported versions

Until v1.0.0, only the latest released minor version receives security fixes. Once v1.0.0 ships, the two most recent minor versions will be supported.

| Version | Supported |
|---------|-----------|
| Latest minor (pre-1.0) | Yes |
| Older pre-1.0 versions | No — please upgrade |

## Scope

In scope:

- Cross-site scripting (XSS), HTML/attribute injection, or any unsafe rendering of user-controlled values inside exported components or hooks
- Prop-based attacks that allow callers to bypass validation, leak state, or escalate behaviour
- Insecure defaults that cause consumers to misuse the library in ways that introduce vulnerabilities (e.g. dangerous use of `dangerouslySetInnerHTML`, unsafe `ref` exposure)
- Regex-based denial of service (ReDoS) reachable through component props or hook inputs
- Server-side rendering hazards (hydration mismatches that expose sensitive values, leaking server state to the client bundle)
- Accessibility regressions that create security-relevant misrepresentations (e.g. a hidden but focusable input that submits unintended data)
- Type-level errors that allow unsafe runtime values to flow through the public API
- Supply-chain or build-pipeline issues affecting the published artifact (tampered tarball, missing provenance, etc.)

Out of scope:

- Issues in the underlying validation algorithms — please report those against [`nationid`](https://github.com/lu1tr0n/nationid/security/advisories/new) so the fix lands at the source
- Reports about input data being PII — `@nationid/react` is a rendering and form layer; data handling and storage are the consumer's responsibility
- Styling, theming, or visual issues without a security impact
- Vulnerabilities in third-party React tooling (Vite, Next.js, Remix, etc.) that are not triggered by this package's code

## Disclosure policy

We follow coordinated disclosure. Once a fix is available we publish a GitHub Security Advisory with credit to the reporter (unless they prefer to remain anonymous). Where applicable, a CVE is requested through the GitHub CNA.

## Supply-chain hardening

`@nationid/react` is published with [npm provenance](https://docs.npmjs.com/generating-provenance-statements) attestations, using npm's [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) flow from a pinned GitHub Actions workflow. The published artifact links back to the exact workflow run that built it. Verify with:

```sh
npm view @nationid/react --json | jq '.dist.attestations'
```

Build and release workflows pin their actions by commit SHA and run under [`step-security/harden-runner`](https://github.com/step-security/harden-runner) with egress auditing, in line with the [OpenSSF Scorecard](https://github.com/ossf/scorecard) `Pinned-Dependencies` and `Token-Permissions` checks. Dependabot is enabled for both npm and GitHub Actions dependencies.
