import { UiComponent } from './UiComponent'
import type { Checker } from './Checker'
import type { GatewayNode } from './GatewayNode'
import type { Tag } from './Tag'
import type { Checkable } from './types'

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
