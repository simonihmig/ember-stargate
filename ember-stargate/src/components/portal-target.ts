import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import type PortalService from '../services/-portal';

export interface PortalTargetSignature {
  Element: HTMLDivElement;
  Args: {
    name: string;
    multiple?: boolean;
    onChange?: (count: number) => void;
  };
  Blocks: { default: [number] };
}

export default class PortalTarget extends Component<PortalTargetSignature> {
  @service('-portal')
  portalService!: PortalService;

  register = modifier((element) => {
    assert('PortalTargets needs a name', this.args.name);
    const options = {
      multiple: this.args.multiple,
      onChange: this.args.onChange,
    };
    this.portalService.registerTarget(this.args.name, element, options);

    return (): void => this.portalService.unregisterTarget(this.args.name);
  });

  get count(): number {
    return this.portalService.getPortalCount(this.args.name);
  }
}
