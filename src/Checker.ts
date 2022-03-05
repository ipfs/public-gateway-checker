
import { GatewayNode } from './GatewayNode'
import { Results } from './Results'
import { Stats } from './Stats'
import { Log } from './Log'

const log = new Log('Checker')

class Checker {
  public readonly element: HTMLElement
  public readonly nodes: GatewayNode[] = []
  private readonly stats: Stats
  private readonly results: Results
  constructor () {
    const element = document.getElementById('checker')
    if (element == null) {
      throw new Error('Element with Id "checker" not found.')
    }
    this.element = element
    this.stats = new Stats(this)
    this.results = new Results(this)
  }

  public updateStats () {
    this.stats.update()
  }

  checkGateways (gateways: string[]) {
    for (const gateway of gateways) {
      const node = new GatewayNode(this.results, gateway, this.nodes.length)
      this.nodes.push(node)
      this.results.append(node.tag)
      setTimeout(() => node.check(), 100 * this.nodes.length)
    }
  }
}

export { Checker }
