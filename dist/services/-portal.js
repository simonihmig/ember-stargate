import Service from '@ember/service';
import { assert } from '@ember/debug';
import { next } from '@ember/runloop';
import { TrackedMap } from 'tracked-built-ins';

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
class PortalService extends Service {
  #targets = new TrackedMap();
  #portalCount = new TrackedMap();
  getTarget(name) {
    return this.#targets.get(name);
  }
  getPortalCount(name) {
    return this.#portalCount.get(name) ?? 0;
  }
  registerTarget(name, element, options) {
    next(this, () => {
      assert(`Portal target with name ${name} already exists`, !this.#targets.has(name));
      this.#targets.set(name, new TargetTracker(name, element, options));
    });
  }
  unregisterTarget(name) {
    this.#targets.delete(name);
    this.#portalCount.delete(name);
  }
  registerPortal(name) {
    next(this, () => {
      const count = (this.#portalCount.get(name) ?? 0) + 1;
      this.#portalCount.set(name, count);
      const target = this.#targets.get(name);
      if (target && target.onChange) {
        target.onChange(count);
      }
    });
  }
  unregisterPortal(name) {
    let count = this.#portalCount.get(name);
    if (count === undefined) {
      return;
    }
    count--;
    this.#portalCount.set(name, count);
    const target = this.#targets.get(name);
    if (target && target.onChange) {
      target.onChange(count);
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.

export { PortalService as default };
//# sourceMappingURL=-portal.js.map
