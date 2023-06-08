import { Tag } from './Tag';
import type { Checker } from './Checker';
import type { GatewayNode } from './GatewayNode';
import type { Results } from './Results';
import type { Visible } from './types';
declare class UiComponent {
    protected parent: Visible | Checker | GatewayNode | Results;
    tag: Tag;
    constructor(parent: Visible | Checker | GatewayNode | Results, ...tagParams: ConstructorParameters<typeof Tag>);
}
export { UiComponent };
//# sourceMappingURL=UiComponent.d.ts.map