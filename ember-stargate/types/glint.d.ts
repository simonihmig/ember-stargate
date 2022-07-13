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
