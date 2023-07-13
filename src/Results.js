class Results {
    parent;
    append(tag) {
        this.element.append(tag.element);
    }
    element;
    constructor(parent) {
        this.parent = parent;
        const element = document.getElementById('checker.results');
        if (element == null) {
            throw new Error('Element with Id "checker.results" not found.');
        }
        this.element = element;
    }
}
export { Results };
//# sourceMappingURL=Results.js.map