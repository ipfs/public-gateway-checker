import type { GatewayNode } from './GatewayNode';
import { UiComponent } from './UiComponent';
declare class Flag extends UiComponent {
    protected parent: GatewayNode;
    private readonly hostname;
    /**
     */
    static readonly googleLimiter: any;
    static readonly cloudFlareLimiter: any;
    constructor(parent: GatewayNode, hostname: string);
    check(): Promise<void>;
    private startLimiters;
    waitForAvailableEndpoint(): Promise<string>;
    private dnsRequest;
    handleDnsQueryResponse(response: DnsQueryResponse): Promise<void>;
    private onError;
    onResponse(response: IpfsGeoip.LookupResponse): void;
}
export { Flag };
//# sourceMappingURL=Flag.d.ts.map