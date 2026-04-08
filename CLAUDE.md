# Development

Changes are tested in consumer projects via [yalc](https://github.com/wclr/yalc). Run `bun run dev` to watch for changes and automatically rebuild and push to linked projects. For one-off pushes, build first then run `bunx yalc push`. To link a consumer project for the first time, run `bunx yalc add @driftime/sanity-plugin-handbook` in that project.

# Releasing

To create a new release, follow these steps in order:

1. Bump the version in `package.json` following semver.
2. Commit the version bump.
3. Draft a changelog and present it for review before proceeding.
4. Create a GitHub release with `gh release create v<version> --title "v<version>" --notes "<changelog>"`. Add `--prerelease` for pre-1.0 versions.
5. Publish to npm with `npm publish`.
