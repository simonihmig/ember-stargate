import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { LifecycleResource, useResource } from 'ember-resources';

class PortalTrackerResource extends LifecycleResource {
  @service('-portal')
  portalService;

  _target;

  get target() {
    return this.portalService.getTarget(this._target);
  }

  setup() {
    this._target = this.args.positional[0];
    next(() => this.portalService.registerPortal(this._target));
  }

  update() {
    const previousTarget = this._target;
    const newTarget = this.args.positional[0];
    next(() => {
      this.portalService.registerPortal(newTarget);
      this.portalService.unregisterPortal(previousTarget);
    });
    this._target = newTarget;
  }

  teardown() {
    this.portalService.unregisterPortal(this._target);
  }
}

export default class PortalComponent extends Component {
  tracker = useResource(this, PortalTrackerResource, () => [this.args.target]);

  get target() {
    return this.tracker.target;
  }

  get renderInPlace() {
    return (
      this.args.renderInPlace === true ||
      (!this.target && this.args.fallback === 'inplace')
    );
  }
}
