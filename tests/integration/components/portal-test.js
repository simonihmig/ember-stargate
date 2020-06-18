import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { dependencySatisfies, macroCondition } from '@embroider/macros';
import sinon from 'sinon';

module('Integration | Component | portal', function (hooks) {
  setupRenderingTest(hooks);

  test('a portal without target does not render anything', async function (assert) {
    await render(hbs`
      <Portal>
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#content').doesNotExist();
  });

  test('a portal with non-existing target does not render anything', async function (assert) {
    await render(hbs`
      <Portal @target="unknown">
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#content').doesNotExist();
  });

  test('a portal without target but with renderInPlace renders in place', async function (assert) {
    await render(hbs`
      <Portal @renderInPlace={{true}}>
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#content').exists();
    assert.dom('#content').hasText('foo');
  });

  test('a portal with existing target renders in target', async function (assert) {
    await render(hbs`
      <PortalTarget @name="main" id="portal" />

      <Portal @target="main">
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');
  });

  test('a portal with target rendered afterwards renders in target', async function (assert) {
    await render(hbs`
      <Portal @target="main">
        <div id="content">foo</div>
      </Portal>

      <PortalTarget @name="main" id="portal" />
    `);

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');
  });

  test('a portal with delayed target renders in target', async function (assert) {
    this.set('showPortal', false);
    await render(hbs`
      {{#if this.showPortal}}
        <PortalTarget @name="main" id="portal" />
      {{/if}}

      <Portal @target="main">
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#content').doesNotExist();

    this.set('showPortal', true);
    await settled();

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');
  });

  test('a portal with removed target removes content', async function (assert) {
    this.set('showPortal', true);
    await render(hbs`
      {{#if this.showPortal}}
        <PortalTarget @name="main" id="portal" />
      {{/if}}

      <Portal @target="main">
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');

    this.set('showPortal', false);
    await settled();

    assert.dom('#content').doesNotExist();
  });

  if (macroCondition(dependencySatisfies('ember-source', '^3.18.0'))) {
    // This usage (in-element clearing DOM from other still active component) seems to not work in Ember <3.18
    // probably due to GlimmerVM changes only introduced in 3.18, see:
    // * https://github.com/emberjs/ember.js/issues/18696
    // * https://github.com/glimmerjs/glimmer-vm/pull/1023
    test('a portal target renders only one portal by default', async function (assert) {
      await render(hbs`
      <PortalTarget @name="main" id="portal" />

      <Portal @target="main">
        <div id="content">foo</div>
      </Portal>

      <Portal @target="main">
        <div id="content2">bar</div>
      </Portal>
    `);

      assert.dom('#portal #content').doesNotExist();

      assert.dom('#portal #content2').exists();
      assert.dom('#portal #content2').hasText('bar');
    });
  }

  test('a portal target can allow multiple portals', async function (assert) {
    await render(hbs`
      <PortalTarget @name="main" @multiple={{true}} id="portal" />

      <Portal @target="main">
        <div id="content">foo</div>
      </Portal>

      <Portal @target="main">
        <div id="content2">bar</div>
      </Portal>
    `);

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');

    assert.dom('#portal #content2').exists();
    assert.dom('#portal #content2').hasText('bar');

    assert.dom('#portal').hasText('foo bar');
  });

  test('a portal target w/ multiple portals yields portal count', async function (assert) {
    this.set('showFirst', false);
    this.set('showSecond', false);
    await render(hbs`
      <PortalTarget @name="main" @multiple={{true}} id="portal" as |count|>
        <div id="count">{{count}}</div>
      </PortalTarget>

      {{#if this.showFirst}}
        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>
      {{/if}}

      {{#if this.showSecond}}
        <Portal @target="main">
          <div id="content2">bar</div>
        </Portal>
      {{/if}}
    `);

    assert.dom('#count').hasText('0');

    this.set('showFirst', true);
    await settled();

    assert.dom('#count').hasText('1');

    this.set('showSecond', true);
    await settled();

    assert.dom('#count').hasText('2');

    this.set('showSecond', false);
    await settled();

    assert.dom('#count').hasText('1');
  });

  test('rendering a portal into a target triggers onChange', async function (assert) {
    this.set('showFirst', false);
    this.set('showSecond', false);

    this.set('action', sinon.spy());

    await render(hbs`
      <PortalTarget @name="main" @multiple={{true}} id="portal" @onChange={{this.action}} />

      {{#if this.showFirst}}
        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>
      {{/if}}

      {{#if this.showSecond}}
        <Portal @target="main">
          <div id="content2">bar</div>
        </Portal>
      {{/if}}
    `);

    assert.notOk(this.action.called);

    this.set('showFirst', true);
    await settled();

    assert.ok(this.action.calledWithExactly(1));

    this.set('showSecond', true);
    await settled();

    assert.ok(this.action.calledWithExactly(2));

    this.set('showSecond', false);
    await settled();

    assert.ok(this.action.calledWithExactly(1));
  });
});
