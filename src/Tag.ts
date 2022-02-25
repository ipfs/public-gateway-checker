import { TagStatus } from './TagStatus';

type TagClasses = string | 'Status' | 'Node'

type TagContent = string | TagStatus

class Tag {
    element: HTMLElement;
    constructor(tagName: keyof HTMLElementTagNameMap, public className: TagClasses | undefined = undefined, public textContent: TagContent = TagStatus.pending) {
        const element = document.createElement(tagName)
        element.className = className
        element.textContent = textContent
        this.element = element
    }

    /**
     * Use the below functions to keep displays consistent
     */
    lose() {
        this.textContent = TagStatus.failed
    }

    win() {
        this.textContent = TagStatus.successful
    }

    global() {
        this.textContent = TagStatus.global
    }

    err() {
        this.textContent = TagStatus.caution
    }
}

export { Tag, TagClasses, TagContent }
