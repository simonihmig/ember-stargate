import Service from '@ember/service';
import { assert } from '@ember/debug';
import { next } from '@ember/runloop';
import { TrackedMap } from 'tracked-maps-and-sets';

interface TargetTrackerOptions {
  multiple?: boolean;
  onChange?: (count: number) => void;
}

export interface Target {
  name: string;
  element: Element;
  multiple: boolean;
}

class TargetTracker implements Target {
  name: string;
  element: Element;
  multiple: boolean;
  onChange?: (count: number) => void;

  constructor(name: string, element: Element, options: TargetTrackerOptions) {
    this.name = name;
    this.element = element;
    this.multiple = options.multiple ?? false;
    this.onChange = options.onChange;
  }
}

export default class PortalService extends Service {
  #targets = new TrackedMap<string, TargetTracker>();
  #portalCount = new TrackedMap<string, number>();

  getTarget(name: string): Target | undefined {
    return this.#targets.get(name);
  }

  getPortalCount(name: string): number {
    return this.#portalCount.get(name) ?? 0;
  }

  registerTarget(
    name: string,
    element: Element,
    options: TargetTrackerOptions
  ): void {
    next(this, () => {
      assert(
        `Portal target with name ${name} already exists`,
        !this.#targets.has(name)
      );
      this.#targets.set(name, new TargetTracker(name, element, options));
    });
  }

  unregisterTarget(name: string): void {
    this.#targets.delete(name);
  }

  registerPortal(name: string): void {
    next(this, () => {
      const count = (this.#portalCount.get(name) ?? 0) + 1;
      this.#portalCount.set(name, count);
      const target = this.#targets.get(name);
      if (target && target.onChange) {
        target.onChange(count);
      }
    });
  }

  unregisterPortal(name: string): void {
    let count = this.#portalCount.get(name) ?? 0;
    assert(
      `Trying to unregister a portal "${name}" that hasn't been registered before`,
      count > 0
    );
    count--;
    this.#portalCount.set(name, count);
    const target = this.#targets.get(name);
    if (target && target.onChange) {
      target.onChange(count);
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    '-portal': PortalService;
  }
}
