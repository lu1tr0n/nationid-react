import { existsSync } from "node:fs";
import { defineConfig } from "tsup";

const ENTRIES = [
  ["index", "src/index.ts"],
  ["rhf/index", "src/rhf/index.ts"],
] as const;

const entry = Object.fromEntries(
  ENTRIES.filter(([, path]) => existsSync(path)).map(([name, path]) => [name, path]),
);

export default defineConfig({
  entry,
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ["react", "react-dom", "react-hook-form", "nationid"],
  target: "es2022",
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
  // Copy the optional stylesheet to dist as-is.
  // Consumers import `@nationid/react/styles.css` only if they want defaults.
  publicDir: "src/styles",
});
