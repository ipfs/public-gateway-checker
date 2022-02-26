import type { Checker } from './Checker'
import type { Tag } from './Tag'

class Results {
  append (tag: Tag) {
    this.element.append(tag.element)
  }

  public readonly element: HTMLElement
  constructor (readonly parent: Checker) {
    this.element = document.getElementById('checker.results')!
  }

  checked () {
    this.parent.updateStats()
  }

  failed () {
    this.parent.updateStats()
  }
}
// checker.results = document.getElementById('checker.results');
// checker.results.parent = checker;
// checker.results.checked = function(node) {
//   this.parent.updateStats(node);
// };

// checker.results.failed = function(node) {
//   this.parent.updateStats(node);
// };

export { Results }
