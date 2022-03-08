import type { Checker } from './Checker'
import type { GatewayNode } from './GatewayNode'
import type { Tag } from './Tag'
import { UiComponent } from './UiComponent'

/**
 * Base Check functionality
 */
class CheckBase extends UiComponent implements Checkable {
  _className = 'Not-set'
  _tagName = 'Not-set'

  get className () {
    return this._className
  }

  get tagName () {
    return this._tagName
  }

  constructor (protected readonly parent: Checker | GatewayNode, ...tagParams: ConstructorParameters<typeof Tag>) {
    super(parent, ...tagParams)
  }

  check () {

  }

  checked () {

  }

  onerror () {
    this.tag.err()
  }
}

export { CheckBase }
