import type Portal from './components/portal';
import type PortalTarget from './components/portal-target';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Portal: typeof Portal;
    PortalTarget: typeof PortalTarget;
  }
}
