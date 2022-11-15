import '@glint/environment-ember-loose';
import StarGateRegistry from 'ember-stargate/template-registry';
import Helper from '@ember/component/helper';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends StarGateRegistry {
    'page-title': new () => Helper<{
      Args: { Positional: [string] };
      Return: void;
    }>;
  }
}
