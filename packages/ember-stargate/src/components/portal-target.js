import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';

export default class PortalTargetComponent extends Component {
  @service('-portal')
  portalService;

  get count() {
    return this.portalService.getPortalCount(this.args.name);
  }

  @action
  register(element) {
    assert('PortalTargets needs a name', this.args.name);
    const options = {
      multiple: this.args.multiple,
      onChange: this.args.onChange,
    };
    this.portalService.registerTarget(this.args.name, element, options);
  }

  @action
  unregister() {
    this.portalService.unregisterTarget(this.args.name);
  }
}
