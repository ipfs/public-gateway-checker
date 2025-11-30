import type { Checker } from './Checker.js'
import type { Tag } from './Tag.js'

class Results {
  append (tag: Tag): void {
    this.element.append(tag.element)
  }

  public readonly element: HTMLElement
  constructor (readonly parent: Checker, elementId: string = 'checker.results') {
    const element = document.getElementById(elementId)
    if (element == null) {
      throw new Error(`Element with Id "${elementId}" not found.`)
    }
    this.element = element
  }
}

export { Results }
