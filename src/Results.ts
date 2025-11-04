import type { Checker } from './Checker.js'
import type { Tag } from './Tag.js'

class Results {
  append (tag: Tag): void {
    this.element.append(tag.element)
  }

  public readonly element: HTMLElement
  constructor (readonly parent: Checker) {
    const element = document.getElementById('checker.results')
    if (element == null) {
      throw new Error('Element with Id "checker.results" not found.')
    }
    this.element = element
  }
}

export { Results }
