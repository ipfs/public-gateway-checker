import { UiComponent } from './UiComponent';
/**
 * Base Check functionality
 */
class CheckBase extends UiComponent {
    constructor(parent, ...tagParams) {
        super(parent, ...tagParams);
        this.parent = parent;
        this._className = 'Not-set';
        this._tagName = 'Not-set';
    }
    get className() {
        return this._className;
    }
    get tagName() {
        return this._tagName;
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