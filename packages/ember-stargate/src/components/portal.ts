import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { LifecycleResource, Positional, useResource } from 'ember-resources';
import type PortalService from '../services/-portal';
import type { Target } from '../services/-portal';

class PortalTrackerResource extends LifecycleResource<Positional<[string]>> {
  @service('-portal')
  portalService!: PortalService;

  _target!: string;

  get target(): Target | undefined {
    return this.portalService.getTarget(this._target);
  }

  setup(): void {
    this._target = this.args.positional[0];
    next(() => this.portalService.registerPortal(this._target));
  }

  update(): void {
    const previousTarget = this._target;
    const newTarget = this.args.positional[0];
    next(() => {
      this.portalService.registerPortal(newTarget);
      this.portalService.unregisterPortal(previousTarget);
    });
    this._target = newTarget;
  }

  teardown(): void {
    this.portalService.unregisterPortal(this._target);
  }
}

interface PortalSignature {
  Args: {
    target: string;
    renderInPlace?: boolean;
    fallback?: 'inplace';
  };
  Blocks: { default: [] };
}

export default class Portal extends Component<PortalSignature> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore the types of ember-resources cause an error here
  tracker = useResource(this, PortalTrackerResource, () => [this.args.target]);

  get target(): Target | undefined {
    return this.tracker.target;
  }

  get renderInPlace(): boolean {
    return (
      this.args.renderInPlace === true ||
      (!this.target && this.args.fallback === 'inplace')
    );
  }
}
