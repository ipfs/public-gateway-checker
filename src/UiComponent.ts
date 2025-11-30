import { Tag } from './Tag.js'
import type { Checker } from './Checker.js'
import type { GatewayNode } from './GatewayNode.js'
import type { Results } from './Results.js'
import type { Visible } from './types.js'

class UiComponent {
  tag: Tag
  constructor (protected parent: Visible | Checker | GatewayNode | Results, ...tagParams: ConstructorParameters<typeof Tag>) {
    this.tag = new Tag(...tagParams)
  }
}

export { UiComponent }
