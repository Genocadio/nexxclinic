import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // Legacy patterns that predate linting. Kept as warnings so the debt
      // stays visible without blocking the build:
      // - The app synchronizes state from props/async data in effects and
      //   calls impure helpers (Date.now/Math.random) during render.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/refs": "warn",
      // `any` usage is tracked by the ongoing type-safety initiative (admin
      // products/departments pages etc.); keep it visible but non-blocking.
      "@typescript-eslint/no-explicit-any": "warn",
      // Legacy form-builder files opt out of type-checking with @ts-nocheck;
      // the reason must be documented inline on each file.
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-nocheck": "allow-with-description" },
      ],
      // unused-imports replaces @typescript-eslint/no-unused-vars with an
      // autofixable version so dead imports/vars can be cleaned mechanically.
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  // RESPONSE_HANDLER_GUIDE.ts is a documentation file whose example code is
  // intentionally never executed — don't flag its unused imports/vars.
  {
    files: ["lib/RESPONSE_HANDLER_GUIDE.ts"],
    rules: {
      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
