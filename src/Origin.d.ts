import { Tag } from './Tag';
import type { GatewayNode } from './GatewayNode';
declare class Origin {
    parent: GatewayNode;
    tag: Tag;
    constructor(parent: GatewayNode);
    check(): Promise<void>;
    onerror(err: Error): void;
}
export { Origin };
//# sourceMappingURL=Origin.d.ts.map