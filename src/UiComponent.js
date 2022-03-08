import { Tag } from './Tag';
class UiComponent {
    constructor(parent, ...tagParams) {
        this.parent = parent;
        this.tag = new Tag(...tagParams);
    }
}
export { UiComponent };
//# sourceMappingURL=UiComponent.js.map