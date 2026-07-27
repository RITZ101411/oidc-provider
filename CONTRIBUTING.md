# Contributing

## Pull Requests

- Branch from `main`
- Branch name: `feat/description`, `fix/description`, `docs/description`, etc.
- Keep PRs focused — one feature or fix per PR
- Ensure `pnpm build` passes before submitting
- Direct pushes to `main` are blocked; all changes go through PRs

## Commit Messages

```
prefix: content
```

### Prefix

- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code restructuring without behavior change
- `docs` — Documentation
- `chore` — Build, config, and other maintenance

### Examples

```
feat: add authorization code flow
fix: correct token expiration validation
refactor: split route handlers into separate modules
docs: add CONTRIBUTING.md
chore: update drizzle-orm to v0.35
```
