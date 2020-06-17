import Service from '@ember/service';
import { assert } from '@ember/debug';
import { TrackedMap } from 'tracked-maps-and-sets';

const defaultTargetOptions = { multiple: false };

export default class PortalService extends Service {
  #targets = new TrackedMap();

  getTarget(name) {
    return this.#targets.get(name);
  }

  registerTarget(name, element, { multiple } = defaultTargetOptions) {
    assert(`Portal target with name ${name} already exists`, !this.#targets.has(name));
    this.#targets.set(name, { element, multiple });
  }

  unregisterTarget(name) {
    this.#targets.delete(name);
  }
}
