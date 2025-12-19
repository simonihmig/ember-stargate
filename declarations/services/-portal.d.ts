import Service from '@ember/service';
interface TargetTrackerOptions {
    multiple?: boolean;
    onChange?: (count: number) => void;
}
export interface Target {
    name: string;
    element: Element;
    multiple: boolean;
}
export default class PortalService extends Service {
    #private;
    getTarget(name: string): Target | undefined;
    getPortalCount(name: string): number;
    registerTarget(name: string, element: Element, options: TargetTrackerOptions): void;
    unregisterTarget(name: string): void;
    registerPortal(name: string): void;
    unregisterPortal(name: string): void;
}
declare module '@ember/service' {
    interface Registry {
        '-portal': PortalService;
    }
}
export {};
