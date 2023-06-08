import { UiComponent } from './UiComponent';
import type { Checker } from './Checker';
import type { GatewayNode } from './GatewayNode';
import type { Tag } from './Tag';
import type { Checkable } from './types';
/**
 * Base Check functionality
 */
declare class CheckBase extends UiComponent implements Checkable {
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
//# sourceMappingURL=CheckBase.d.ts.map