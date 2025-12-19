import Component from '@glimmer/component';
import type PortalService from '../services/-portal';
import type { Target } from '../services/-portal';
declare class Tracker {
    portalService: PortalService;
    _target?: string;
    modify(newTarget: string): void;
    get target(): Target | undefined;
    destroy(): void;
}
export interface PortalSignature {
    Args: {
        target: string;
        renderInPlace?: boolean;
        fallback?: 'inplace';
    };
    Blocks: {
        default: [];
    };
}
export default class Portal extends Component<PortalSignature> {
    tracker: Tracker;
    get target(): Target | undefined;
    get renderInPlace(): boolean;
}
export {};
