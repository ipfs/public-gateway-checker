import { Tag } from './Tag.js'
import { UiComponent } from './UiComponent.js'
import type { Checker } from './Checker.js'
import type { GatewayNode } from './GatewayNode.js'

class Stats extends UiComponent {
  gateways: HTMLDivElement
  totals: HTMLDivElement
  private readonly nodes: GatewayNode[]

  constructor (readonly parent: Checker, elementId: string = 'checker.stats', nodes?: GatewayNode[]) {
    super(parent)
    const statsElement = document.getElementById(elementId)
    if (statsElement == null) {
      throw new Error(`Could not find element with Id "${elementId}"`)
    }
    this.tag = Tag.fromElement(statsElement)
    this.nodes = nodes ?? parent.nodes

    this.gateways = document.createElement('div')
    this.gateways.textContent = '0/0 tested'
    this.gateways.className = 'Gateways'
    this.tag.append(this.gateways)

    this.totals = document.createElement('div')
    this.totals.textContent = '0 online'
    this.totals.className = 'Totals'
    this.tag.append(this.totals)
  }

  public update (): void {
    let up = 0
    let down = 0
    for (const savedNode of this.nodes) {
      if (savedNode.status.up) {
        up += 1
      } else if (savedNode.status.down) {
        down += 1
      }
    }
    this.gateways.textContent = `${up + down}/${this.nodes.length} tested`
    this.totals.textContent = `${up} online`
  }
}

export { Stats }
