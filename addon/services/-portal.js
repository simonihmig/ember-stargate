import Service from '@ember/service';
import { assert } from '@ember/debug';
import { TrackedMap } from 'tracked-maps-and-sets';

class TargetTracker {
  name;
  element;
  multiple;
  onChange;

  constructor(name, element, options) {
    this.name = name;
    this.element = element;
    this.multiple = options.multiple ?? false;
    this.onChange = options.onChange;
  }
}

export default class PortalService extends Service {
  #targets = new TrackedMap();
  #portalCount = new TrackedMap();

  getTarget(name) {
    return this.#targets.get(name);
  }

  getPortalCount(name) {
    return this.#portalCount.get(name) ?? 0;
  }

  registerTarget(name, element, options) {
    assert(`Portal target with name ${name} already exists`, !this.#targets.has(name));
    this.#targets.set(name, new TargetTracker(name, element, options));
  }

  unregisterTarget(name) {
    this.#targets.delete(name);
  }

  registerPortal(name) {
    const count = (this.#portalCount.get(name) ?? 0) + 1;
    this.#portalCount.set(name, count);
    const target = this.getTarget(name);
    if (target && target.onChange) {
      target.onChange(count);
    }
  }

  unregisterPortal(name) {
    let count = this.#portalCount.get(name) ?? 0;
    assert(`Trying to unregister a portal that hasn't been registered before`, count > 0);
    count--;
    this.#portalCount.set(name, count);
    const target = this.getTarget(name);
    if (target && target.onChange) {
      target.onChange(count);
    }
  }
}
