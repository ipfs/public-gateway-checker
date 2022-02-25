import { Checker } from './Checker';
import { Tag } from './Tag';

class UiComponent {
    tag: Tag
    constructor(protected parent: Checker, ...tagParams: ConstructorParameters<typeof Tag>) {
        this.tag = new Tag(...tagParams)
    }
}

export { UiComponent }
