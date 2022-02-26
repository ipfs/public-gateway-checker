// let checker = document.getElementById('checker');

import { GatewayNode } from './GatewayNode'
import { Results } from './Results'
import { Stats } from './Stats'

// checker.nodes = [];
class Checker {
  public readonly element: HTMLElement
  public readonly nodes: GatewayNode[] = []
  private readonly stats: Stats
  private readonly results: Results
  // gateway: string | URL
  // private results: HTMLElement;
  constructor () {
    this.element = document.getElementById('checker')!
    this.stats = new Stats(this)
    this.results = new Results(this)
    // this.results = document.getElementById('checker.results');
    // this.results.parent = this
  }

  // checker.updateStats = function() {
  //   this.stats.update();
  // };
  public updateStats () {
    this.stats.update()
  }

  // checker.checkGateways = function(gateways) {
  //   for (const gateway of gateways) {
  //     const node = new Node(this.results, gateway, this.nodes.length)
  //     this.nodes.push(node)
  //     this.results.append(node.tag)
  //     setTimeout(() => node.check(), 100 * this.nodes.length);
  //   }
  // }
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
