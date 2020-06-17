import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PortalComponent extends Component {
  @service('-portal')
  portalService;

  get target() {
    return this.args.target && this.portalService.getTarget(this.args.target);
  }
}
