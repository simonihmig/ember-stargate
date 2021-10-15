import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { LifecycleResource, useResource } from 'ember-resources';

class PortalTrackerResource extends LifecycleResource {
  @service('ember-stargate@-portal')
  portalService;

  target;

  setup() {
    this.target = this.args.positional[0];
    next(() => this.portalService.registerPortal(this.target));
  }

  update() {
    const previousTarget = this.target;
    const newTarget = this.args.positional[0];
    next(() => {
      this.portalService.registerPortal(newTarget);
      this.portalService.unregisterPortal(previousTarget);
    });
    this.target = newTarget;
  }

  teardown() {
    this.portalService.unregisterPortal(this.target);
  }
}

export default class PortalComponent extends Component {
  @service('ember-stargate@-portal')
  portalService;

  tracker = useResource(this, PortalTrackerResource, () => [this.args.target]);

  get target() {
    return (
      this.tracker.target && this.portalService.getTarget(this.tracker.target)
    );
  }

  get renderInPlace() {
    return (
      this.args.renderInPlace === true ||
      (!this.target && this.args.fallback === 'inplace')
    );
  }
}
