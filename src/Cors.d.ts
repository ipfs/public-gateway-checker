import { CheckBase } from './CheckBase';
import type { GatewayNode } from './GatewayNode';
declare class Cors extends CheckBase implements Checkable {
    protected parent: GatewayNode;
    _className: string;
    _tagName: string;
    constructor(parent: GatewayNode);
    check(): Promise<void>;
    checked(): void;
    onerror(): void;
}
export { Cors };
//# sourceMappingURL=Cors.d.ts.map