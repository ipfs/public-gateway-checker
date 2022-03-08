import { GatewayNode } from './GatewayNode';
declare class Checker {
    readonly element: HTMLElement;
    readonly nodes: GatewayNode[];
    private readonly stats;
    private readonly results;
    constructor();
    private updateStats;
    checkGateways(gateways: string[]): Promise<void>;
}
export { Checker };
//# sourceMappingURL=Checker.d.ts.map