# Contributing to Fulcra

Thank you for contributing to Fulcra. This document outlines the engineering standards, workflow commands, and commit conventions used across the monorepo.

---

## Prerequisites

- **Node.js**: `>=24.0.0` (active LTS recommended)
- **pnpm**: `11.25.0` (declared in `package.json#packageManager`)

Verify your environment:

```bash
node -v   # Should output v24.x.x
pnpm -v   # Should output 11.25.0
```

---

## Getting Started

1. Clone the repository and install dependencies from the monorepo root:

   ```bash
   pnpm install
   ```

   > **Note:** The `prepare` script will automatically initialize Husky Git hooks (`.husky/pre-commit` and `.husky/commit-msg`).

2. Start the local development server:

   ```bash
   pnpm dev
   ```

   To run only the web application:

   ```bash
   pnpm --filter web dev
   ```

---

## Repository Commands

All validation commands run through Turborepo from the root:

| Command             | Action                                     | Scope                |
| ------------------- | ------------------------------------------ | -------------------- |
| `pnpm dev`          | Start development servers                  | Monorepo / Turborepo |
| `pnpm build`        | Compile production bundles                 | Monorepo / Turborepo |
| `pnpm lint`         | Run ESLint checks                          | Monorepo / Turborepo |
| `pnpm check-types`  | Run TypeScript validation (`tsc --noEmit`) | Monorepo / Turborepo |
| `pnpm format`       | Auto-format files using Prettier           | Entire monorepo      |
| `pnpm format:check` | Check file formatting without writing      | Entire monorepo      |

---

## Commit Message Convention

Fulcra uses [Conventional Commits](https://www.conventionalcommits.org/) (`@commitlint/config-conventional`). All commit messages are automatically validated by the `.husky/commit-msg` hook.

### Structure

```text
<type>(<optional scope>): <description>
```

### Allowed Types

- `feat`: A new user-facing feature or primitive
- `fix`: A bug fix
- `docs`: Documentation updates
- `style`: Formatting, missing semicolons, whitespace changes
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or correcting tests
- `build`: Changes affecting build systems or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Routine maintenance, repo tooling, or housekeeping
- `revert`: Reverting a previous commit

### Examples

```bash
git commit -m "feat(ui): add candidate profile card primitive"
git commit -m "fix(web): correct sidebar active border indicator alignment"
git commit -m "docs: update repository engineering guidelines"
git commit -m "ci: add pull request validation workflow"
```

Malformed commit messages will be rejected by the hook.

---

## Pre-commit Verification

When you run `git commit`, the `.husky/pre-commit` hook automatically triggers `lint-staged`:

- **TypeScript / TSX files (`*.{ts,tsx}`)**: Runs `eslint --fix` and `prettier --write`.
- **Config & Documentation files (`*.{json,yaml,yml,md,css}`)**: Runs `prettier --write`.

This ensures staged code adheres to project formatting and linting rules without incurring the overhead of running full builds during local development.

---

## Continuous Integration (CI)

Every push and pull request targeting the `main` branch runs the GitHub Actions CI pipeline (`.github/workflows/ci.yml`):

1. Dependency installation with frozen lockfile (`pnpm install --frozen-lockfile`)
2. Format verification (`pnpm format:check`)
3. Workspace linting (`pnpm lint`)
4. Type checking (`pnpm check-types`)
5. Production build (`pnpm build`)

All checks must pass before pull requests are merged.
