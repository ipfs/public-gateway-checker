import { Checker } from './Checker';
import { Check } from './global';
import { Tag } from './Tag';
import { UiComponent } from './UiComponent';

/**
 * Base Check functionality
 */
class CheckBase extends UiComponent implements Check  {
    constructor(protected readonly parent: Checker, ...tagParams: ConstructorParameters<typeof Tag>) {
        super(parent, ...tagParams)
    }

    check () {

    }

    checked() {

    }
    onerror() {
        this.tag.err()
    }
}

export { CheckBase }
