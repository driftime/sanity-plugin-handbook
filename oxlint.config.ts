import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    reportUnusedDisableDirectives: "error",
    typeAware: true,
    typeCheck: true,
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: ["eslint", "import", "jsdoc", "jsx-a11y", "oxc", "promise", "react", "typescript", "unicorn"],
  categories: {
    correctness: "error",
    nursery: "error",
    pedantic: "error",
    perf: "error",
    restriction: "error",
    style: "error",
    suspicious: "error",
  },
  rules: {
    // Single-line blocks are visually unambiguous; braces are only needed when blocks span multiple lines.
    curly: ["error", "multi-line", "consistent"],

    // TypeScript infers return types reliably; explicit annotations add noise without safety.
    "explicit-function-return-type": "off",

    // Inline exports alongside declarations are clearer than a separate export block at the end.
    "import/exports-last": "off",

    // Separate type imports from the same module are intentional, not duplicates.
    "no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],

    // Relative parent imports are the standard way to reference sibling directories in a flat src/ tree.
    "import/no-relative-parent-imports": "off",

    // Consolidating exports into a single block separates declaration from export for no benefit.
    "import/group-exports": "off",

    // Modern codebases naturally have many imports; an arbitrary limit does not reflect complexity.
    "import/max-dependencies": "off",

    // Type declarations are side-effect imports.
    "import/no-unassigned-import": ["error", { allow: ["**/*.d.ts"] }],

    // Sanity plugin conventions require default exports.
    "import/no-default-export": "off",

    // Build tooling legitimately uses Node.js builtins.
    "import/no-nodejs-modules": "off",

    // Named exports enable tree shaking and explicit imports.
    "import/no-named-export": "off",

    // Single-export files do not need to be default exports.
    "import/prefer-default-export": "off",

    // Destructured parameters are documented by their type definitions.
    "jsdoc/require-param": ["error", { checkDestructured: false }],

    // TypeScript handles parameter types; JSDoc type annotations are redundant.
    "jsdoc/require-param-type": "off",

    // TypeScript handles return types; JSDoc type annotations are redundant.
    "jsdoc/require-returns-type": "off",

    // React and Sanity conventions use function declarations.
    "func-style": ["error", "declaration"],

    // Naming conventions are enforced through code review, not arbitrary length limits.
    "id-length": "off",

    // TypeScript infers return types reliably, and this is a plugin, not a published library.
    "explicit-module-boundary-types": "off",

    // Debug logging should not ship to production, but intentional logging is part of the application.
    "no-console": ["error", { allow: ["info", "warn", "error"] }],

    // Arbitrary numeric limits do not reflect actual code complexity.
    "max-depth": "off",
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-params": "off",
    "max-statements": "off",

    // Continue is a valid control flow statement in loops.
    "no-continue": "off",

    // Numbers in this codebase are self-evident in context; naming them adds noise without clarity.
    "no-magic-numbers": "off",

    // React components are uppercase functions, not constructors.
    "new-cap": ["error", { capIsNew: false }],

    // Void as a statement is useful for discarding return values in arrow functions.
    "no-void": ["error", { allowAsStatement: true }],

    // React components use null to indicate an intentionally empty render.
    "unicorn/no-null": "off",

    // Explicit undefined is necessary for consistent return paths in functions with mixed returns.
    "unicorn/no-useless-undefined": "off",

    // All target environments support async/await natively.
    "oxc/no-async-await": "off",

    // Spreading inside map calls is a standard pattern for constructing new objects.
    "oxc/no-map-spread": "off",

    // All target environments support optional chaining natively.
    "no-optional-chaining": "off",

    // Object rest and spread are fundamental to React component prop forwarding.
    "oxc/no-rest-spread-properties": "off",

    // The automatic JSX transform does not require React in scope.
    "react/react-in-jsx-scope": "off",

    // TypeScript projects use .tsx for JSX, not .jsx.
    "react/jsx-filename-extension": "off",

    // Context provider values are not performance-sensitive in this plugin.
    "react/jsx-no-constructed-context-values": "off",

    // Single-expression fragments are valid when returning dynamic children.
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],

    // Component architecture naturally controls nesting depth; an arbitrary limit adds no value.
    "react/jsx-max-depth": "off",

    // Prop spreading is a deliberate pattern for forwarding HTML attributes to underlying elements.
    "react/jsx-props-no-spreading": "off",

    // React composition patterns require multiple related components in a single file.
    "react/no-multi-comp": "off",

    // Co-locating types and constants with components is more valuable than Fast Refresh optimisation.
    "react/only-export-components": "off",

    // Flat ternaries are often the clearest way to express conditional values, especially in JSX.
    "no-ternary": "off",

    // The undefined keyword has been read-only since ES5; void 0 is unnecessary.
    "no-undefined": "off",

    // React and Sanity types do not export readonly variants, making this impractical.
    "prefer-readonly-parameter-types": "off",

    // Oxfmt owns declaration ordering; the linter only needs to enforce member ordering.
    "sort-imports": ["error", { ignoreDeclarationSort: true }],

    // Semantic grouping in schemas and component props is more meaningful than alphabetical order.
    "sort-keys": "off",
  },
});
