import { UiComponent } from './UiComponent';
/**
 * Base Check functionality
 */
class CheckBase extends UiComponent {
    parent;
    _className = 'Not-set';
    _tagName = 'Not-set';
    get className() {
        return this._className;
    }
    get tagName() {
        return this._tagName;
    }
    constructor(parent, ...tagParams) {
        super(parent, ...tagParams);
        this.parent = parent;
    }
    check() {
    }
    checked() {
    }
    onerror() {
        this.tag.err();
    }
}
export { CheckBase };
//# sourceMappingURL=CheckBase.js.map