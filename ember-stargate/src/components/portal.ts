import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { Resource } from 'ember-modify-based-class-resource';
import type PortalService from '../services/-portal';
import type { Target } from '../services/-portal';
import { registerDestructor } from '@ember/destroyable';

interface PortalTrackerResourceArgs {
  Positional: [string];
}

class PortalTrackerResource extends Resource<PortalTrackerResourceArgs> {
  @service('-portal')
  portalService!: PortalService;

  _target?: string;

  constructor(owner: unknown) {
    super(owner);

    registerDestructor(
      this,
      () => this._target && this.portalService.unregisterPortal(this._target)
    );
  }

  get target(): Target | undefined {
    return this._target
      ? this.portalService.getTarget(this._target)
      : undefined;
  }

  modify([newTarget]: [string]): void {
    const previousTarget = this._target;
    next(() => {
      this.portalService.registerPortal(newTarget);
      if (previousTarget) {
        this.portalService.unregisterPortal(previousTarget);
      }
    });
    this._target = newTarget;
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
  tracker = PortalTrackerResource.from(this, () => [this.args.target]);

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
