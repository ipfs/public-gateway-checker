import { Cors } from './Cors';
import { Flag } from './Flag';
import { Origin } from './Origin';
import { Trustless } from './Trustless';
import type { Results } from './Results';
import { Status } from './Status';
import { UiComponent } from './UiComponent';
import { IPNSCheck } from './Ipns';
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