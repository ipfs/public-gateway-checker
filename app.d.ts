declare module "src/Util" {
    class Util {
        static HASH_TO_TEST: string;
        static IMG_HASH: string;
        static HASH_STRING: string;
        static ipfs_http_client: import("ipfs-http-client/types/src/types").IPFSHTTPClient;
        static checkViaImgSrc(imgUrl: string | URL): Promise<void>;
        static gatewayHostname(url: URL): string;
        static OnScriptloaded(src: ConstructorParameters<typeof URL>[0]): void;
        static expectSubdomainRedirect(url: string | URL): Promise<void>;
    }
    export { Util };
}
declare module "src/Cors" {
    import { CheckBase } from "src/CheckBase";
    import type { GatewayNode } from "src/GatewayNode";
    class Cors extends CheckBase implements Checkable {
        protected parent: GatewayNode;
        _className: string;
        _tagName: string;
        constructor(parent: GatewayNode);
        check(): void;
        checked(): void;
        onerror(): void;
    }
    export { Cors };
}
declare module "src/TagStatus" {
    enum TagStatus {
        pending = "\uD83D\uDD51",
        successful = "\u2705",
        caution = "\u26A0\uFE0F",
        failed = "\u274C",
        global = "\uD83C\uDF0D",
        asterisk = "*"
    }
    export { TagStatus };
}
declare module "src/Tag" {
    import { TagStatus } from "src/TagStatus";
    type TagClasses = 'Status' | 'Node' | 'Cors' | 'Origin' | 'Flag';
    type TagContent = TagStatus;
    class Tag {
        element: HTMLElement;
        constructor(tagName?: keyof HTMLElementTagNameMap, className?: TagClasses | undefined, textContent?: TagContent);
        static fromElement(element: HTMLElement): Tag;
        /**
         * Use the below functions to keep displays consistent
         */
        asterisk(): void;
        lose(): void;
        win(): void;
        global(): void;
        err(): void;
        get style(): CSSStyleDeclaration;
        append(child: string | Node | Tag): void;
        get classList(): DOMTokenList;
        set title(newTitle: string);
        private set className(value);
        private set textContent(value);
    }
    export type { TagClasses, TagContent };
    export { Tag };
}
declare module "src/Results" {
    import type { Checker } from "src/Checker";
    import type { Tag } from "src/Tag";
    class Results {
        readonly parent: Checker;
        append(tag: Tag): void;
        readonly element: HTMLElement;
        constructor(parent: Checker);
        checked(): void;
        failed(): void;
    }
    export { Results };
}
declare module "src/UiComponent" {
    import type { Checker } from "src/Checker";
    import type { GatewayNode } from "src/GatewayNode";
    import type { Results } from "src/Results";
    import { Tag } from "src/Tag";
    class UiComponent {
        protected parent: Visible | Checker | GatewayNode | Results;
        tag: Tag;
        constructor(parent: Visible | Checker | GatewayNode | Results, ...tagParams: ConstructorParameters<typeof Tag>);
    }
    export { UiComponent };
}
declare module "src/Flag" {
    import type { GatewayNode } from "src/GatewayNode";
    import { UiComponent } from "src/UiComponent";
    class Flag extends UiComponent {
        protected parent: GatewayNode;
        private readonly hostname;
        private static requests;
        constructor(parent: GatewayNode, hostname: string);
        setup(): void;
        onResponse(response: IpfsGeoip.LookupResponse): void;
    }
    export { Flag };
}
declare module "src/Origin" {
    import type { GatewayNode } from "src/GatewayNode";
    import { Tag } from "src/Tag";
    class Origin {
        parent: GatewayNode;
        tag: Tag;
        constructor(parent: GatewayNode);
        check(): void;
        onerror(): void;
    }
    export { Origin };
}
declare module "src/Status" {
    import type { GatewayNode } from "src/GatewayNode";
    import { UiComponent } from "src/UiComponent";
    class Status extends UiComponent {
        readonly parent: GatewayNode;
        up: boolean;
        constructor(parent: GatewayNode);
        check(): void;
        checked(): void;
        onerror(): void;
    }
    export { Status };
}
declare module "src/GatewayNode" {
    import { Cors } from "src/Cors";
    import { Flag } from "src/Flag";
    import { Origin } from "src/Origin";
    import type { Results } from "src/Results";
    import { Status } from "src/Status";
    import { UiComponent } from "src/UiComponent";
    class GatewayNode extends UiComponent implements Checkable {
        readonly parent: Results;
        status: Status;
        cors: Cors;
        origin: Origin;
        link: HTMLDivElement & {
            url?: URL;
        };
        flag: Flag;
        took: HTMLDivElement;
        gateway: string;
        index: unknown;
        checkingTime: number;
        constructor(parent: Results, gateway: string, index: unknown);
        check(): void;
        checked(): void;
        failed(): void;
        onerror(): void;
    }
    export { GatewayNode };
}
declare module "src/Stats" {
    import type { Checker } from "src/Checker";
    import { UiComponent } from "src/UiComponent";
    class Stats extends UiComponent {
        readonly parent: Checker;
        gateways: HTMLDivElement;
        totals: HTMLDivElement;
        constructor(parent: Checker);
        update(): void;
    }
    export { Stats };
}
declare module "src/Checker" {
    import { GatewayNode } from "src/GatewayNode";
    class Checker {
        readonly element: HTMLElement;
        readonly nodes: GatewayNode[];
        private readonly stats;
        private readonly results;
        constructor();
        updateStats(): void;
        checkGateways(gateways: string[]): void;
    }
    export { Checker };
}
declare module "src/CheckBase" {
    import type { Checker } from "src/Checker";
    import type { GatewayNode } from "src/GatewayNode";
    import type { Tag } from "src/Tag";
    import { UiComponent } from "src/UiComponent";
    /**
     * Base Check functionality
     */
    class CheckBase extends UiComponent implements Checkable {
        protected readonly parent: Checker | GatewayNode;
        _className: string;
        _tagName: string;
        get className(): string;
        get tagName(): string;
        constructor(parent: Checker | GatewayNode, ...tagParams: ConstructorParameters<typeof Tag>);
        check(): void;
        checked(): void;
        onerror(): void;
    }
    export { CheckBase };
}
declare module "src/app" { }
//# sourceMappingURL=app.d.ts.map