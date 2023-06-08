import type { Checker } from './Checker';
import type { Tag } from './Tag';
declare global {
    interface Window {
        checker: Checker;
    }
}
/**
 * An interface that allows various properties for gateways to be checked
 */
export interface Checkable {
    check: () => void;
    checked: () => void;
    onerror: () => void;
}
/**
 * A class implementing the Visible interface supports functionality that can make it visible in the UI
 */
export interface Visible {
    tag: Tag;
    _tagName: string;
    _className: string;
}
export interface DnsQueryResponseAnswer {
    name: string;
    type: number;
    TTL: number;
    data: string;
}
export interface DnsQueryResponseQuestion {
    name: string;
    type: number;
}
export interface DnsQueryResponseAuthority {
    TTL: number;
    data: string;
    name: string;
    type: number;
}
export interface DnsQueryResponse {
    AD: boolean;
    Answer?: DnsQueryResponseAnswer[];
    Authority?: DnsQueryResponseAuthority[];
    CD: boolean;
    Question: DnsQueryResponseQuestion[];
    RA: boolean;
    RD: boolean;
    Status: number;
    TC: boolean;
}
//# sourceMappingURL=types.d.ts.map