import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

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
});
