// Add any types here that you need for local development only.
// These will *not* be published as part of your addon, so be careful that your published code does not rely on them!

import '@glint/environment-ember-loose';
import Modifier from 'ember-modifier';

declare class RenderModifier<
  Args extends unknown[] = unknown[]
> extends Modifier<{
  Element: HTMLElement;
  Args: { Positional: [(element: Element, args: Args) => void, ...Args] };
}> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'did-insert': typeof RenderModifier;
    'will-destroy': typeof RenderModifier;
  }
}
