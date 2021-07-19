ember-stargate
==============================================================================

[![CI](https://github.com/kaliber5/ember-stargate/actions/workflows/ci.yml/badge.svg)](https://github.com/kaliber5/ember-stargate/actions/workflows/ci.yml)
[![Ember Observer Score](https://emberobserver.com/badges/ember-stargate.svg)](https://emberobserver.com/addons/ember-stargate)

A modern take on using so called "portals" to render things in a
different place of the DOM tree than they are logically defined in the app.

Implemented using lightweight Glimmer components and Ember's new `{{in-element}}`,
but without its caveats.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.16 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-stargate
```


Why this addon?
------------------------------------------------------------------------------

There are a number of existing solutions in the Ember ecosystem for the same
problem, so why this addon you may ask?

Let's see how it compares to some of those...

#### ember-wormhole

The first addon to make portals popular in Ember uses proprietary implementation 
tricks, that make it potentially less stable. Also defining portal targets in your
app is less flexible.

#### ember-elsewhere

While using only public Ember APIs, due to its requirement to use Ember's 
`component` helper it comes with some caveats:
* you cannot send arbitrary content though the portal, it must be a single component
* you cannot use a [component in block form](https://github.com/ef4/ember-elsewhere/issues/2)
* the component helper does not support passing HTML attributes (as in regular angle bracket invocation)

#### in-element

While Ember starting with 3.20 (or earlier using [ember-in-element-polyfill](https://github.com/ember-polyfills/ember-in-element-polyfill) 
has a built-in primitive with `{{in-element}}`, due to its (intentional) low-level nature it is suitable
more for usage in addons (for things like modals, tooltips, dropdowns), but using it in apps is not very ergonomic:
* it requires you to pass a reference to the target DOM element, which is less ergonomic than a CSS selector or some other
  higher-level way to define the target (e.g. a target component)
* that DOM element has to *exist* already before using `{{in-element}}`, so it's sensitive to rendering timings

Other than that, `{{in-element}}` is a very useful primitive, and in fact this addon uses it under the hood, 
with just some simple higher-level abstractions on top of it! 

Usage
------------------------------------------------------------------------------

You need two things to make a portal work: define the content that should be sent through the portal using
`<Portal @target="some-target">`, and the target - identified by its name - where it should be rendered to 
using `<PortalTarget @name="some-target">`.

Let's take an example where we want to render a sticky footer inside `application.hbs`, as it will be used 
across routes, but the actual content (left and right sections for action buttons etc. and a title) needs 
to be defined within the actual routes;

step1.hbs:
```hbs
<Portal @target="footer-title">Step 1</Portal>

<Portal @target="footer-left">
 <LinkTo @route="index">Back</LinkTo>
</Portal>

<Portal @target="footer-right">
 <button type="button" {{on "click" this.submit}}>Submit and proceed</button>
</Portal>
```

application.hbs:

```hbs
{{outlet}}

<footer class="sticky-footer">
  <PortalTarget @name="footer-left" class="sticky-footer__left" />
  
  <PortalTarget @name="footer-title" class="sticky-footer__title" />
  
  <PortalTarget @name="footer-right" class="sticky-footer__right" />
</footer>
```

Note that although the footer will be rendered *after* the portals, as it comes after the `{{outlet}}` at the
bottom of the DOM, this poses no problem for this addon as it explicitly supports this case: a portal's content 
will not be rendered until its target is available, but then the target will immediately show the portal's content.


API
------------------------------------------------------------------------------

### Portal

* `@target`: required argument to specify the name of the target
* `@fallback`: by default the portal's content will not render until the target is available. 
  With `@fallback="inplace"` the content will be rendered in place as long as the target is not available.
* `@renderInPlace`: if `true` the portal is effectively disabled, and the content is rendered in place.  

### PortalTarget

* `@name`: required argument that identifies the target
* `@multiple`: by default if multiple portals refer to the same target, they will replace each other 
  (in the order of rendering). With `@multiple={{true}}` the portal's content will be appended (again in the order of rendering).
* `@onChange`: whenever a portal is rendered to or removed from the target, this action will be called. It will receive 
  the current portal count of this target as an argument.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
