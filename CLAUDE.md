# Project Guidelines

## Environment

**Package manager.** This project uses Bun. Install dependencies with exact versions using `-E`, and use `-D` for development dependencies.

**Scripts.** Prefer scripts defined in `package.json` over running tools directly — manual invocation is fine when needed, but project scripts should be the default.

**Linting.** Never add lint suppression comments without explicit approval. If a rule seems worth suppressing, suggest it and wait.

**Local development.** Changes are tested in consumer projects via [yalc](https://github.com/wclr/yalc). Run `bun run dev` to watch for changes and automatically rebuild and push to linked projects. For one-off pushes, build first then run `bunx yalc push`. To link a consumer project for the first time, run `bunx yalc add @driftime/sanity-plugin-handbook` in that project.

## Oxlint Configuration

**Ordering.** Rules in `oxlint.config.ts` are sorted alphabetically. Maintain this when adding new ones.

**Configure before disabling.** Explore a rule's options before reaching for `"off"`. Only disable a rule when no configuration makes it useful.

**Comments.** Every rule must have a comment explaining why it's configured that way, not what the rule does.

**Tool boundaries.** Oxfmt owns formatting and Oxlint owns linting. Configure them so they don't overlap.

## Behaviour

**British English.** All written content uses British English — responses, comments, documentation, everything. The exception is code identifiers and programming keywords where the language demands American spelling, like `color` in CSS or `backgroundColor` in JavaScript.

**Stay focused.** Work only on what has been asked. If you spot issues elsewhere, flag them but don't fix them. Other people or agents may be working on other parts of the codebase.

**Match existing patterns.** Before creating anything new, study existing examples of that same kind of thing. Understand their structure, naming, spacing, and patterns, then match them. New code should feel like it was written by the same hand. If no comparable examples exist, or existing examples conflict with each other, raise this before proceeding.

## Code

**Naming.** Use complete, unabbreviated identifiers. Constants use camelCase like any other variable. Import specific exports by name rather than accessing them through a namespace.

**Ordering.** When a definition establishes an order — whether that's a type, an interface, a schema, or anything else — everything that consumes or mirrors that definition should follow the same order. This includes destructuring, function parameters, component props, and query fields, among other things. When a spread pattern makes strict ordering impractical, the properties that follow the spread should still respect the definition's order relative to each other.

**File structure.** Files follow a consistent top-to-bottom order: imports, type and interface definitions, constants, functions, then component functions.

**Absence.** Always use `undefined` to represent missing values. Only use `null` when a third-party API or library requires it.

## React

**Props.** Derive component props from `ComponentProps<"element">` matching the root element, so standard attributes are inherited rather than redeclared.

**Wrapping components.** When wrapping an existing component, derive props from its type and use `Omit` for any props you're handling internally. This preserves the original component's type constraints, including discriminated unions.

## TypeScript

**No `any`.** Prefer specific types over `unknown` wherever possible, and never use `any`.

**Inferred return types.** Don't define return types explicitly — let TypeScript infer them unless the compiler or linter demands otherwise.

## Documentation

**What to document.** Add JSDoc to utility functions, constants, and interface properties. React components and component prop types don't need it. Constants that are framework conventions or self-evident from context are also exempt — the rule targets constants whose purpose or value isn't obvious without it.

**How to document.** Describe what code accomplishes, not how. Summaries should survive refactoring — avoid referencing specific function names or implementation details. Always include `@param` and `@returns` tags, without type annotations.

## Releasing

To create a new release, follow these steps in order:

1. Bump the version in `package.json` following semver.
2. Commit the version bump.
3. Draft a changelog and present it for review before proceeding.
4. Create a GitHub release with `gh release create v<version> --title "v<version>" --notes "<changelog>"`. Add `--prerelease` for pre-1.0 versions.
5. Publish to npm with `npm publish`.
