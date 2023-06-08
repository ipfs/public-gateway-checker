import { Cors } from './Cors';
import { Flag } from './Flag';
import { IPNSCheck } from './Ipns';
import { Origin } from './Origin';
import { Status } from './Status';
import { Trustless } from './Trustless';
import { UiComponent } from './UiComponent';
import type { Results } from './Results';
declare class GatewayNode extends UiComponent {
    readonly parent: Results;
    status: Status;
    cors: Cors;
    ipns: IPNSCheck;
    origin: Origin;
    trustless: Trustless;
    link: HTMLDivElement & {
        url?: URL;
    };
    flag: Flag;
    took: HTMLDivElement;
    gateway: string;
    index: unknown;
    checkingTime: number;
    atLeastOneSuccess: boolean;
    constructor(parent: Results, gateway: string, index: unknown);
    check(): Promise<void>;
    private onSuccessfulCheck;
    onerror(): void;
}
export { GatewayNode };
//# sourceMappingURL=GatewayNode.d.ts.map