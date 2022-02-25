class Results {
    element: HTMLElement;
    constructor(private readonly parent: Checker) {
        this.element = document.getElementById('checker.results');

    }

    private checked(node) {
        this.parent.updateStats(node)
    }

    private failed(node) {
        this.parent.updateStats(node);
    };

}
// checker.results = document.getElementById('checker.results');
// checker.results.parent = checker;
// checker.results.checked = function(node) {
// 	this.parent.updateStats(node);
// };

// checker.results.failed = function(node) {
// 	this.parent.updateStats(node);
// };

export { Results }
