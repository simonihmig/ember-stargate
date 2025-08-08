import Component from '@glimmer/component';
import { service } from '@ember/service';
import { next } from '@ember/runloop';
import { use, resource } from 'ember-resources';
import type PortalService from '../services/-portal';
import type { Target } from '../services/-portal';
import { setOwner } from '@ember/application';

class Tracker {
  @service('-portal')
  portalService!: PortalService;

  _target?: string;

  modify(newTarget: string): void {
    const previousTarget = this._target;
    next(() => {
      this.portalService.registerPortal(newTarget);
      if (previousTarget) {
        this.portalService.unregisterPortal(previousTarget);
      }
    });
    this._target = newTarget;
  }

  get target(): Target | undefined {
    return this._target
      ? this.portalService.getTarget(this._target)
      : undefined;
  }

  destroy(): void {
    if (!this._target) {
      return;
    }

    this.portalService.unregisterPortal(this._target);
  }
}

function PortalTrackerResource(inputFn: () => string): Tracker {
  const state = new Tracker();

  return resource(({ on, owner }) => {
    setOwner(state, owner);

    on.cleanup(() => state.destroy());

    return (): Tracker => {
      state.modify(inputFn());

      return state;
    };
  });
}

export interface PortalSignature {
  Args: {
    target: string;
    renderInPlace?: boolean;
    fallback?: 'inplace';
  };
  Blocks: { default: [] };
}

export default class Portal extends Component<PortalSignature> {
  @use tracker = PortalTrackerResource(() => this.args.target);

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
