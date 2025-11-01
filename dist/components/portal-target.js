import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { service } from '@ember/service';
import { assert } from '@ember/debug';
import { precompileTemplate } from '@ember/template-compilation';
import { g, i } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<div {{this.register}} ...attributes>{{yield this.count}}</div>");

class PortalTarget extends Component {
  static {
    g(this.prototype, "portalService", [service('-portal')]);
  }
  #portalService = (i(this, "portalService"), void 0);
  register = modifier(element => {
    assert('PortalTargets needs a name', this.args.name);
    const options = {
      multiple: this.args.multiple,
      onChange: this.args.onChange
    };
    this.portalService.registerTarget(this.args.name, element, options);
    return () => this.portalService.unregisterTarget(this.args.name);
  });
  get count() {
    return this.portalService.getPortalCount(this.args.name);
  }
}
setComponentTemplate(TEMPLATE, PortalTarget);

export { PortalTarget as default };
//# sourceMappingURL=portal-target.js.map
