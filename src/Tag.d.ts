import { TagStatus } from './TagStatus';
declare type TagClasses = 'Cors' | 'Flag' | 'Ipns' | 'Node' | 'Origin' | 'Status' | 'Trustless';
declare type TagContent = TagStatus;
declare class Tag {
    element: HTMLElement;
    constructor(tagName?: keyof HTMLElementTagNameMap, className?: TagClasses | undefined, textContent?: TagContent);
    static fromElement(element: HTMLElement): Tag;
    /**
     * Use the below functions to keep displays consistent
     */
    asterisk(): void;
    lose(): void;
    win(url?: string): void;
    global(): void;
    err(): void;
    empty(): void;
    get style(): CSSStyleDeclaration;
    append(child: string | Node | Tag): void;
    get classList(): DOMTokenList;
    set title(newTitle: string);
    private set className(value);
    private set textContent(value);
}
export type { TagClasses, TagContent };
export { Tag };
//# sourceMappingURL=Tag.d.ts.map