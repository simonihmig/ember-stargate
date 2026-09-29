# How To Contribute

## Installation

- `git clone <repository-url>`
- `cd ember-stargate`
- `pnpm install`

## Linting

- `pnpm lint`
- `pnpm lint:fix`

## Building the addon

- `pnpm build`

## Running tests

- `pnpm test` – Runs the test suite on the current Ember version
- `pnpm dlx @embroider/try apply <scenario>` – Applies an Ember version scenario from `.try.mjs`. Then run `pnpm install --no-lockfile` and `pnpm test`. The command edits `package.json`, so revert it afterwards.

## Running the demo application

- `pnpm start`
- Visit the URL that Vite prints.
