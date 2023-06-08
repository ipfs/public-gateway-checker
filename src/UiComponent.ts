import { Tag } from './Tag'
import type { Checker } from './Checker'
import type { GatewayNode } from './GatewayNode'
import type { Results } from './Results'
import type { Visible } from './types'

class UiComponent {
  tag: Tag
  constructor (protected parent: Visible | Checker | GatewayNode | Results, ...tagParams: ConstructorParameters<typeof Tag>) {
    this.tag = new Tag(...tagParams)
  }
}

export { UiComponent }
