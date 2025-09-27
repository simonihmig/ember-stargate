import Component from '@glimmer/component';
import type PortalService from '../services/-portal';
export interface PortalTargetSignature {
    Element: HTMLDivElement;
    Args: {
        name: string;
        multiple?: boolean;
        onChange?: (count: number) => void;
    };
    Blocks: {
        default: [number];
    };
}
export default class PortalTarget extends Component<PortalTargetSignature> {
    portalService: PortalService;
    register: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    get count(): number;
}
