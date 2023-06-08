import { UiComponent } from './UiComponent';
import type { GatewayNode } from './GatewayNode';
declare class Status extends UiComponent {
    readonly parent: GatewayNode;
    private _up;
    private _down;
    constructor(parent: GatewayNode);
    check(): Promise<void>;
    get down(): boolean;
    set down(value: boolean);
    get up(): boolean;
    set up(value: boolean);
    onerror(): void;
}
export { Status };
//# sourceMappingURL=Status.d.ts.map