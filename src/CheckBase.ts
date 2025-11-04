import { UiComponent } from './UiComponent.js'
import type { Checker } from './Checker.js'
import type { GatewayNode } from './GatewayNode.js'
import type { Tag } from './Tag.js'
import type { Checkable } from './types.js'

/**
 * Base Check functionality
 */
class CheckBase extends UiComponent implements Checkable {
  _className = 'Not-set'
  _tagName = 'Not-set'

  get className (): string {
    return this._className
  }

  get tagName (): string {
    return this._tagName
  }

  constructor (protected readonly parent: Checker | GatewayNode, ...tagParams: ConstructorParameters<typeof Tag>) {
    super(parent, ...tagParams)
  }

  check (): void {

  }

  checked (): void {

  }

  onerror (): void {
    this.tag.err()
  }
}

export { CheckBase }
