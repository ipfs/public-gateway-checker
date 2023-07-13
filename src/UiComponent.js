import { Tag } from './Tag';
class UiComponent {
    parent;
    tag;
    constructor(parent, ...tagParams) {
        this.parent = parent;
        this.tag = new Tag(...tagParams);
    }
}
export { UiComponent };
//# sourceMappingURL=UiComponent.js.map