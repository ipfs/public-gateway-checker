import { GatewayNode } from './GatewayNode.js'
import { Log } from './Log.js'
import { Results } from './Results.js'
import { Stats } from './Stats.js'

const log = new Log('Checker')

class Checker {
  public readonly element: HTMLElement
  public readonly nodes: GatewayNode[] = []
  public readonly onionNodes: GatewayNode[] = []
  private readonly stats: Stats
  private readonly onionStats: Stats
  private readonly results: Results
  private readonly onionResults: Results
  private readonly onionSection: HTMLElement | null
  private readonly onionMessage: HTMLElement | null

  constructor () {
    const element = document.getElementById('checker')
    if (element == null) {
      throw new Error('Element with Id "checker" not found.')
    }
    this.element = element
    this.stats = new Stats(this)
    this.results = new Results(this)
    this.onionResults = new Results(this, 'checker.onion.results')
    this.onionStats = new Stats(this, 'checker.onion.stats', this.onionNodes)
    this.onionSection = document.getElementById('checker.onion')
    this.onionMessage = document.getElementById('checker.onion.message')
    this.updateStats = this.updateStats.bind(this)
    this.updateOnionStats = this.updateOnionStats.bind(this)
  }

  private updateStats (): void {
    this.stats.update()
  }

  private updateOnionStats (): void {
    this.onionStats.update()
  }

  async checkGateways (gateways: string[]): Promise<void> {
    const allChecks: Array<Promise<void>> = []
    for (const gateway of gateways) {
      const node = new GatewayNode(this.results, gateway, this.nodes.length)
      this.nodes.push(node)
      this.results.append(node.tag)
      // void node.check()
      setTimeout(() => {
        allChecks.push(node.check().catch((err) => { log.error(err) }).finally(this.updateStats))
      }, 100 * this.nodes.length)
    }
    // await Promise.all(allChecks).finally(this.updateStats)
  }

  async checkOnionGateways (gateways: string[]): Promise<void> {
    // Hide section if no onion gateways configured
    if (gateways.length === 0) {
      this.onionSection?.classList.add('hidden')
      return
    }

    const allChecks: Array<Promise<void>> = []
    for (const gateway of gateways) {
      const node = new GatewayNode(this.onionResults, gateway, this.onionNodes.length)
      this.onionNodes.push(node)
      this.onionResults.append(node.tag)
      setTimeout(() => {
        allChecks.push(node.check().catch((err) => { log.error(err) }).finally(this.updateOnionStats))
      }, 100 * this.onionNodes.length)
    }

    // Wait for all tests to complete, then show message if all failed
    const totalDelay = 100 * this.onionNodes.length + 100
    setTimeout(() => {
      void Promise.allSettled(allChecks).then(() => {
        const anyOnline = this.onionNodes.some(n => n.status.up)
        if (!anyOnline && this.onionMessage != null) {
          this.onionMessage.classList.remove('hidden')
          const onionStatsElement = document.getElementById('checker.onion.stats')
          onionStatsElement?.classList.add('hidden')
        }
      })
    }, totalDelay)
  }
}

export { Checker }
