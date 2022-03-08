class Results {
    constructor(parent) {
        this.parent = parent;
        const element = document.getElementById('checker.results');
        if (element == null) {
            throw new Error('Element with Id "checker.results" not found.');
        }
        this.element = element;
    }
    append(tag) {
        this.element.append(tag.element);
    }
}
export { Results };
//# sourceMappingURL=Results.js.map