








## v1.0.2 (2025-09-06)

#### :bug: Bug Fix
* [#762](https://github.com/simonihmig/ember-stargate/pull/762) fix deprecation: `Importing `inject` from `@ember/service` is deprecated.` ([@johanrd](https://github.com/johanrd))

#### Committers: 1
- [@johanrd](https://github.com/johanrd)

## v1.0.1 (2024-12-03)

#### :bug: Bug Fix
* [#741](https://github.com/simonihmig/ember-stargate/pull/741) Fix addon-main.cjs missing in published npm package ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v1.0.0 (2024-11-14)

#### :rocket: Enhancement
* [#735](https://github.com/simonihmig/ember-stargate/pull/735) Update @glimmer/component to allow for v2 ([@simonihmig](https://github.com/simonihmig))
* [#710](https://github.com/simonihmig/ember-stargate/pull/710) Drop @ember/render-modifiers usage ([@simonihmig](https://github.com/simonihmig))
* [#708](https://github.com/simonihmig/ember-stargate/pull/708) Import TrackedMap from tracked-built-ins instead of tracked-maps-and-sets #701 ([@johanrd](https://github.com/johanrd))
* [#704](https://github.com/simonihmig/ember-stargate/pull/704) Upgrades ember-resources to newest version which allows @glimmer/component v2.0.0 as peer dependency. ([@johanrd](https://github.com/johanrd))

#### :bug: Bug Fix
* [#702](https://github.com/simonihmig/ember-stargate/pull/702) Export `Portal` and `PortalTarget` signatures ([@didoo](https://github.com/didoo))

#### :house: Internal
* [#718](https://github.com/simonihmig/ember-stargate/pull/718) Update v2 addon boilerplate ([@simonihmig](https://github.com/simonihmig))
* [#706](https://github.com/simonihmig/ember-stargate/pull/706) Disable prototype extensions to fix Ember 6 tests ([@simonihmig](https://github.com/simonihmig))

#### Committers: 3
- Cristiano Rastelli ([@didoo](https://github.com/didoo))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@johanrd](https://github.com/johanrd)

## v0.6.0 (2024-06-03)

#### :boom: Breaking Change
* [#696](https://github.com/simonihmig/ember-stargate/pull/696) Drop support for Ember < 4.12 ([@simonihmig](https://github.com/simonihmig))
* [#687](https://github.com/simonihmig/ember-stargate/pull/687) Require ember-resources v7 ([@basz](https://github.com/basz))

#### :rocket: Enhancement
* [#687](https://github.com/simonihmig/ember-stargate/pull/687) Require ember-resources v7 ([@basz](https://github.com/basz))

#### Committers: 2
- Bas Kamer ([@basz](https://github.com/basz))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v0.5.0 (2023-07-21)

#### :boom: Breaking Change
* [#608](https://github.com/simonihmig/ember-stargate/pull/608) Drop Ember 3.24 support ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* [#636](https://github.com/simonihmig/ember-stargate/pull/636) Update to Glint 1.0 ([@simonihmig](https://github.com/simonihmig))
* [#635](https://github.com/simonihmig/ember-stargate/pull/635) Make portal target render as empty ([@simonihmig](https://github.com/simonihmig))

#### :bug: Bug Fix
* [#644](https://github.com/simonihmig/ember-stargate/pull/644) Fix `Trying to unregister a portal` assertion when immediately unrendering portal ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#655](https://github.com/simonihmig/ember-stargate/pull/655) Drop rollup-plugin-ts, use updated addon blueprint ([@simonihmig](https://github.com/simonihmig))
* [#634](https://github.com/simonihmig/ember-stargate/pull/634) Update dependencies for Ember 5 ([@simonihmig](https://github.com/simonihmig))
* [#633](https://github.com/simonihmig/ember-stargate/pull/633) Update to use node 18 internally ([@simonihmig](https://github.com/simonihmig))
* [#596](https://github.com/simonihmig/ember-stargate/pull/596) Align v2 addon boilerplate with latest blueprint ([@simonihmig](https://github.com/simonihmig))
* [#586](https://github.com/simonihmig/ember-stargate/pull/586) Update release-it plugins ([@simonihmig](https://github.com/simonihmig))
* [#563](https://github.com/simonihmig/ember-stargate/pull/563) Setup ESLint + TS properly in test-app ([@simonihmig](https://github.com/simonihmig))
* [#553](https://github.com/simonihmig/ember-stargate/pull/553) Update workspace layout ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v0.4.3 (2022-07-01)

#### :rocket: Enhancement
* `ember-stargate`
  * [#541](https://github.com/kaliber5/ember-stargate/pull/541) Upgrade to ember-resources v5 ([@simonihmig](https://github.com/simonihmig))

#### :bug: Bug Fix
* `ember-stargate`, `test-app`
  * [#537](https://github.com/kaliber5/ember-stargate/pull/537) Ensure PortalTarget onChange is called on initial render ([@meirish](https://github.com/meirish))

#### Committers: 2
- Matthew Irish ([@meirish](https://github.com/meirish))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v0.4.2 (2022-05-31)

#### :rocket: Enhancement
* `ember-stargate`, `test-app`
  * [#494](https://github.com/kaliber5/ember-stargate/pull/494) Expose Glint types ([@simonihmig](https://github.com/simonihmig))
* `ember-stargate`
  * [#491](https://github.com/kaliber5/ember-stargate/pull/491) Convert to TypeScript ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* `test-app`
  * [#378](https://github.com/kaliber5/ember-stargate/pull/378) Fix Embroider testing setup ([@simonihmig](https://github.com/simonihmig))

#### Committers: 2
- Benedikt Deicke ([@benedikt](https://github.com/benedikt))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v0.4.0 (2021-10-28)

#### :boom: Breaking Change
* `ember-stargate`, `test-app`
  * [#324](https://github.com/kaliber5/ember-stargate/pull/324) Convert to v2 addon ([@simonihmig](https://github.com/simonihmig))
* Other
  * [#319](https://github.com/kaliber5/ember-stargate/pull/319) Require ember-auto-import v2 ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* `ember-stargate`, `test-app`
  * [#324](https://github.com/kaliber5/ember-stargate/pull/324) Convert to v2 addon ([@simonihmig](https://github.com/simonihmig))

#### :bug: Bug Fix
* [#318](https://github.com/kaliber5/ember-stargate/pull/318) Fix changing portal targets, uses resources instead of lifecycle hooks ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v0.3.0 (2021-08-30)

#### :boom: Breaking Change
* [#263](https://github.com/kaliber5/ember-stargate/pull/263) Update `tracked-maps-and-sets` to support Ember 4.0, drop support for Ember <3.24 ([@simonihmig](https://github.com/simonihmig))
* [#252](https://github.com/kaliber5/ember-stargate/pull/252) Drop node 10 support ([@simonihmig](https://github.com/simonihmig))
* [#251](https://github.com/kaliber5/ember-stargate/pull/251) Update to Ember 3.27, drop support for Ember <3.20 ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* [#263](https://github.com/kaliber5/ember-stargate/pull/263) Update `tracked-maps-and-sets` to support Ember 4.0, drop support for Ember <3.24 ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* [#264](https://github.com/kaliber5/ember-stargate/pull/264) Configure Renovate ([@renovate[bot]](https://github.com/apps/renovate))
* [#251](https://github.com/kaliber5/ember-stargate/pull/251) Update to Ember 3.27, drop support for Ember <3.20 ([@simonihmig](https://github.com/simonihmig))
* [#9](https://github.com/kaliber5/ember-stargate/pull/9) Removed the public version of the -portal service ([@cah-briangantzler](https://github.com/cah-briangantzler))

#### Committers: 4
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Brian Gantzler ([@cah-briangantzler](https://github.com/cah-briangantzler))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.2.0 (2020-06-19)

#### :boom: Breaking Change
* [#5](https://github.com/kaliber5/ember-stargate/pull/5) Introduce fallback=inplace behaviour, change semantics of renderInPlace ([@simonihmig](https://github.com/simonihmig))

#### :rocket: Enhancement
* [#5](https://github.com/kaliber5/ember-stargate/pull/5) Introduce fallback=inplace behaviour, change semantics of renderInPlace ([@simonihmig](https://github.com/simonihmig))

#### Committers: 1
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## v0.1.0 (2020-06-19)

Initial release
