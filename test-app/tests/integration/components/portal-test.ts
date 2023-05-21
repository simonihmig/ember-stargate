import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | portal', function (hooks) {
  setupRenderingTest(hooks);

  test('a portal without target does not render anything', async function (assert) {
    await render(hbs`
      <Portal @target="">
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

  test('a portal without target but with fallback=inplace renders in place', async function (assert) {
    await render(hbs`
      <Portal @target="" @fallback="inplace">
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#content').exists();
    assert.dom('#content').hasText('foo');
  });

  test('a portal with renderInPlace renders in place', async function (assert) {
    await render(hbs`
      <PortalTarget @name="main" id="portal" />
      <Portal @target="main" @renderInPlace={{true}}>
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#content').exists();
    assert.dom('#content').hasText('foo');
    assert.dom('#portal #content').doesNotExist();
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

  test('switching between targets with the same name', async function (assert) {
    this.set('showPortal', true);

    await render(hbs`
      {{#if this.showPortal}}
        <PortalTarget @name="main" id="portal" />
      {{else}}
        <PortalTarget @name="main" id="other-portal" />
      {{/if}}

      <Portal @target="main">
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');
    assert.dom('#other-portal').doesNotExist();

    this.set('showPortal', false);
    await settled();

    assert.dom('#other-portal #content').exists();
    assert.dom('#other-portal #content').hasText('foo');
    assert.dom('#portal').doesNotExist();
  });

  test('switching the target moves existing content', async function (assert) {
    this.set('target', 'p1');
    await render(hbs`
      <PortalTarget @name="p1" id="p1"/>
      <PortalTarget @name="p2" id="p2"/>

      <Portal @target={{this.target}}>
        <div id="content">foo</div>
      </Portal>
    `);

    assert.dom('#p1').hasText('foo');
    assert.dom('#p2').hasNoText();

    this.set('target', 'p2');
    await settled();

    assert.dom('#p1').hasNoText();
    assert.dom('#p2').hasText('foo');
  });

  test('a portal target renders as an empty div', async function (assert) {
    await render(hbs`
      <PortalTarget @name="main" id="portal" />
    `);

    assert.dom('div#portal:empty').exists();
  });

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

    const action = sinon.spy();
    this.set('action', action);

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

    assert.notOk(action.called);

    this.set('showFirst', true);
    await settled();

    assert.ok(action.calledWithExactly(1));

    this.set('showSecond', true);
    await settled();

    assert.ok(action.calledWithExactly(2));

    this.set('showSecond', false);
    await settled();

    assert.ok(action.calledWithExactly(1));
  });

  test('initial rendering a portal into a target triggers onChange', async function (assert) {
    const action = sinon.spy();
    this.set('action', action);

    await render(hbs`
      <PortalTarget @name="main" @multiple={{true}} id="portal" @onChange={{this.action}} />

      <Portal @target="main">
        <div id="content">foo</div>
      </Portal>

      <Portal @target="main">
        <div id="content2">bar</div>
      </Portal>
    `);

    assert.ok(action.calledWithExactly(1));
    assert.ok(action.calledWithExactly(2));
    assert.strictEqual(action.callCount, 2);
  });

  test('portal can be immediately unrendered', async function (assert) {
    assert.expect(0);

    this.set('show', true);
    const promise = render(hbs`
      {{#if this.show}}
      xxx
      <PortalTarget @name="main" />
      <Portal @target="main">
        foo
      </Portal>
      {{/if}}
    `);

    await rerender();

    this.set('show', false);

    await promise;
  });
});
