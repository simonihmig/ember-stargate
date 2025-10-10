import Component from '@glimmer/component';
import { service } from '@ember/service';
import { next } from '@ember/runloop';
import { use, resource } from 'ember-resources';
import { setOwner } from '@ember/application';
import { g, i } from 'decorator-transforms/runtime';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if this.renderInPlace}}\n  {{yield}}\n{{else if this.target}}\n  {{#if this.target.multiple}}\n    {{#in-element this.target.element insertBefore=null}}\n      {{yield}}\n    {{/in-element}}\n  {{else}}\n    {{#in-element this.target.element}}\n      {{yield}}\n    {{/in-element}}\n  {{/if}}\n{{/if}}\n");

class Tracker {
  static {
    g(this.prototype, "portalService", [service('-portal')]);
  }
  #portalService = (i(this, "portalService"), void 0);
  _target;
  modify(newTarget) {
    const previousTarget = this._target;
    next(() => {
      this.portalService.registerPortal(newTarget);
      if (previousTarget) {
        this.portalService.unregisterPortal(previousTarget);
      }
    });
    this._target = newTarget;
  }
  get target() {
    return this._target ? this.portalService.getTarget(this._target) : undefined;
  }
  destroy() {
    if (!this._target) {
      return;
    }
    this.portalService.unregisterPortal(this._target);
  }
}
function PortalTrackerResource(inputFn) {
  const state = new Tracker();
  return resource(({
    on,
    owner
  }) => {
    setOwner(state, owner);
    on.cleanup(() => state.destroy());
    return () => {
      state.modify(inputFn());
      return state;
    };
  });
}
class Portal extends Component {
  static {
    g(this.prototype, "tracker", [use], function () {
      return PortalTrackerResource(() => this.args.target);
    });
  }
  #tracker = (i(this, "tracker"), void 0);
  get target() {
    return this.tracker.target;
  }
  get renderInPlace() {
    return this.args.renderInPlace === true || !this.target && this.args.fallback === 'inplace';
  }
}
setComponentTemplate(TEMPLATE, Portal);

export { Portal as default };
//# sourceMappingURL=portal.js.map
