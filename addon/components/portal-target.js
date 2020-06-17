import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';

export default class PortalTargetComponent extends Component {
  @service('-portal')
  portalService;

  @action
  register(element) {
    assert('PortalTargets needs a name', this.args.name);
    this.portalService.registerTarget(this.args.name, element, { multiple: this.args.multiple });
  }

  @action
  unregister() {
    this.portalService.unregisterTarget(this.args.name);
  }
}
