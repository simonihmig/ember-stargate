import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default class PortalComponent extends Component {
  @service('-portal')
  portalService;

  constructor() {
    super(...arguments);
    next(() => this.portalService.registerPortal(this.args.target));
  }

  get target() {
    return this.args.target && this.portalService.getTarget(this.args.target);
  }

  get renderInPlace() {
    return this.args.renderInPlace === true || (!this.target && this.args.fallback === 'inplace');
  }

  willDestroy() {
    super.willDestroy();
    next(() => this.portalService.unregisterPortal(this.args.target));
  }
}
