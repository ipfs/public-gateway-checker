import { TagStatus } from './TagStatus';
class Tag {
    constructor(tagName = 'div', className = undefined, textContent = TagStatus.pending) {
        const element = document.createElement(tagName);
        this.element = element;
        if (className != null) {
            this.className = className;
        }
        this.textContent = textContent;
    }
    static fromElement(element) {
        const tag = new Tag('div');
        tag.element = element;
        return tag;
    }
    /**
     * Use the below functions to keep displays consistent
     */
    asterisk() {
        this.textContent = TagStatus.asterisk;
    }
    lose() {
        this.textContent = TagStatus.failed;
    }
    win(url) {
        if (url != null) {
            this.textContent = TagStatus.empty;
            const linkToImageSubdomain = document.createElement('a');
            linkToImageSubdomain.href = url;
            linkToImageSubdomain.target = '_blank';
            linkToImageSubdomain.textContent = TagStatus.successful;
            this.element.title = url;
            this.element.appendChild(linkToImageSubdomain);
        }
        else {
            this.textContent = TagStatus.successful;
        }
    }
    global() {
        this.textContent = TagStatus.global;
    }
    err() {
        this.textContent = TagStatus.caution;
    }
    empty() {
        this.textContent = TagStatus.empty;
    }
    get style() {
        return this.element.style;
    }
    append(child) {
        if (child instanceof Tag) {
            child = child.element;
        }
        this.element.append(child);
    }
    get classList() {
        return this.element.classList;
    }
    // eslint-disable-next-line accessor-pairs
    set title(newTitle) {
        this.element.title = newTitle;
    }
    // eslint-disable-next-line accessor-pairs
    set className(className) {
        this.element.className = className;
    }
    // eslint-disable-next-line accessor-pairs
    set textContent(content) {
        this.element.textContent = content;
    }
}
export { Tag };
//# sourceMappingURL=Tag.js.map