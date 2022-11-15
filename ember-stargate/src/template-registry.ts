import type Portal from './components/portal';
import type PortalTarget from './components/portal-target';

export default interface Registry {
  Portal: typeof Portal;
  PortalTarget: typeof PortalTarget;
}
