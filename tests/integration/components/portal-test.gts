import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, settled } from '@ember/test-helpers';
import { tracked } from 'tracked-built-ins';
import sinon from 'sinon';
import Portal from '#src/components/portal.gts';
import PortalTarget from '#src/components/portal-target.gts';

module('Integration | Component | portal', function (hooks) {
  setupRenderingTest(hooks);

  test('a portal without target does not render anything', async function (assert) {
    await render(
      <template>
        <Portal @target="">
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#content').doesNotExist();
  });

  test('a portal with non-existing target does not render anything', async function (assert) {
    await render(
      <template>
        <Portal @target="unknown">
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#content').doesNotExist();
  });

  test('a portal without target but with fallback=inplace renders in place', async function (assert) {
    await render(
      <template>
        <Portal @target="" @fallback="inplace">
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#content').exists();
    assert.dom('#content').hasText('foo');
  });

  test('a portal with renderInPlace renders in place', async function (assert) {
    await render(
      <template>
        <PortalTarget @name="main" id="portal" />
        <Portal @target="main" @renderInPlace={{true}}>
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#content').exists();
    assert.dom('#content').hasText('foo');
    assert.dom('#portal #content').doesNotExist();
  });

  test('a portal with existing target renders in target', async function (assert) {
    await render(
      <template>
        <PortalTarget @name="main" id="portal" />

        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');
  });

  test('a portal with target rendered afterwards renders in target', async function (assert) {
    await render(
      <template>
        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>

        <PortalTarget @name="main" id="portal" />
      </template>,
    );

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');
  });

  test('a portal with delayed target renders in target', async function (assert) {
    const state = tracked({ showPortal: false });
    await render(
      <template>
        {{#if state.showPortal}}
          <PortalTarget @name="main" id="portal" />
        {{/if}}

        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#content').doesNotExist();

    state.showPortal = true;
    await settled();

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');
  });

  test('a portal with removed target removes content', async function (assert) {
    const state = tracked({ showPortal: true });
    await render(
      <template>
        {{#if state.showPortal}}
          <PortalTarget @name="main" id="portal" />
        {{/if}}

        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');

    state.showPortal = false;
    await settled();

    assert.dom('#content').doesNotExist();
  });

  test('switching between targets with the same name', async function (assert) {
    const state = tracked({ showPortal: true });
    await render(
      <template>
        {{#if state.showPortal}}
          <PortalTarget @name="main" id="portal" />
        {{else}}
          <PortalTarget @name="main" id="other-portal" />
        {{/if}}

        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');
    assert.dom('#other-portal').doesNotExist();

    state.showPortal = false;
    await settled();

    assert.dom('#other-portal #content').exists();
    assert.dom('#other-portal #content').hasText('foo');
    assert.dom('#portal').doesNotExist();
  });

  test('switching the target moves existing content', async function (assert) {
    const state = tracked({ target: 'p1' });
    await render(
      <template>
        <PortalTarget @name="p1" id="p1" />
        <PortalTarget @name="p2" id="p2" />

        <Portal @target={{state.target}}>
          <div id="content">foo</div>
        </Portal>
      </template>,
    );

    assert.dom('#p1').hasText('foo');
    assert.dom('#p2').hasNoText();

    state.target = 'p2';
    await settled();

    assert.dom('#p1').hasNoText();
    assert.dom('#p2').hasText('foo');
  });

  test('a portal target renders as an empty div', async function (assert) {
    await render(
      <template><PortalTarget @name="main" id="portal" /></template>,
    );

    assert.dom('div#portal:empty').exists();
  });

  test('a portal target renders no whitespace around its element', async function (assert) {
    await render(
      <template>
        <div id="wrapper"><PortalTarget @name="main" /></div>
      </template>,
    );

    assert.strictEqual(
      document.querySelector('#wrapper')?.childNodes.length,
      1,
    );
  });

  test('a portal target renders only one portal by default', async function (assert) {
    await render(
      <template>
        <PortalTarget @name="main" id="portal" />

        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>

        <Portal @target="main">
          <div id="content2">bar</div>
        </Portal>
      </template>,
    );

    assert.dom('#portal #content').doesNotExist();

    assert.dom('#portal #content2').exists();
    assert.dom('#portal #content2').hasText('bar');
  });

  test('a portal target can allow multiple portals', async function (assert) {
    await render(
      <template>
        <PortalTarget @name="main" @multiple={{true}} id="portal" />

        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>

        <Portal @target="main">
          <div id="content2">bar</div>
        </Portal>
      </template>,
    );

    assert.dom('#portal #content').exists();
    assert.dom('#portal #content').hasText('foo');

    assert.dom('#portal #content2').exists();
    assert.dom('#portal #content2').hasText('bar');

    assert.dom('#portal').hasText('foo bar');
  });

  test('a portal target w/ multiple portals yields portal count', async function (assert) {
    const state = tracked({ showFirst: false, showSecond: false });
    await render(
      <template>
        <PortalTarget @name="main" @multiple={{true}} id="portal" as |count|>
          <div id="count">{{count}}</div>
        </PortalTarget>

        {{#if state.showFirst}}
          <Portal @target="main">
            <div id="content">foo</div>
          </Portal>
        {{/if}}

        {{#if state.showSecond}}
          <Portal @target="main">
            <div id="content2">bar</div>
          </Portal>
        {{/if}}
      </template>,
    );

    assert.dom('#count').hasText('0');

    state.showFirst = true;
    await settled();

    assert.dom('#count').hasText('1');

    state.showSecond = true;
    await settled();

    assert.dom('#count').hasText('2');

    state.showSecond = false;
    await settled();

    assert.dom('#count').hasText('1');
  });

  test('rendering a portal into a target triggers onChange', async function (assert) {
    const state = tracked({ showFirst: false, showSecond: false });
    const onChange = sinon.spy();

    await render(
      <template>
        <PortalTarget
          @name="main"
          @multiple={{true}}
          id="portal"
          @onChange={{onChange}}
        />

        {{#if state.showFirst}}
          <Portal @target="main">
            <div id="content">foo</div>
          </Portal>
        {{/if}}

        {{#if state.showSecond}}
          <Portal @target="main">
            <div id="content2">bar</div>
          </Portal>
        {{/if}}
      </template>,
    );

    assert.notOk(onChange.called);

    state.showFirst = true;
    await settled();

    assert.ok(onChange.calledWithExactly(1));

    state.showSecond = true;
    await settled();

    assert.ok(onChange.calledWithExactly(2));

    state.showSecond = false;
    await settled();

    assert.ok(onChange.calledWithExactly(1));
  });

  test('initial rendering a portal into a target triggers onChange', async function (assert) {
    const onChange = sinon.spy();

    await render(
      <template>
        <PortalTarget
          @name="main"
          @multiple={{true}}
          id="portal"
          @onChange={{onChange}}
        />

        <Portal @target="main">
          <div id="content">foo</div>
        </Portal>

        <Portal @target="main">
          <div id="content2">bar</div>
        </Portal>
      </template>,
    );

    assert.ok(onChange.calledWithExactly(1));
    assert.ok(onChange.calledWithExactly(2));
    assert.strictEqual(onChange.callCount, 2);
  });

  test('portal can be immediately unrendered', async function (assert) {
    assert.expect(0);

    const state = tracked({ show: true });
    const promise = render(
      <template>
        {{#if state.show}}
          xxx
          <PortalTarget @name="main" />
          <Portal @target="main">
            foo
          </Portal>
        {{/if}}
      </template>,
    );

    await rerender();

    state.show = false;

    await promise;
  });
});
