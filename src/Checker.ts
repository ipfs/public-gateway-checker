// let checker = document.getElementById('checker');

import { GatewayNode } from './GatewayNode';
import { Results } from './Results';
import { Stats } from './Stats';

// checker.nodes = [];
class Checker {
    private element: HTMLElement;
    private nodes: unknown[];
    private stats: Stats;
    private results: Results;
    gateway: string | URL;
    // private results: HTMLElement;
    constructor() {
        this.element = document.getElementById('checker');
        this.stats = new Stats(this)
        this.results = new Results(this)
        // this.results = document.getElementById('checker.results');
        // this.results.parent = this
    }

    // checker.updateStats = function() {
    // 	this.stats.update();
    // };
    public updateStats(_: any) {
        this.stats.update();
    };

    // checker.checkGateways = function(gateways) {
    //   for (const gateway of gateways) {
    //     const node = new Node(this.results, gateway, this.nodes.length)
    //     this.nodes.push(node)
    //     this.results.append(node.tag)
    //     setTimeout(() => node.check(), 100 * this.nodes.length);
    //   }
    // }
    checkGateways(gateways) {
        for (const gateway of gateways) {
            const node = new GatewayNode(this.results, gateway, this.nodes.length)
            this.nodes.push(node)
            this.results.append(node.tag)
            setTimeout(() => node.check(), 100 * this.nodes.length);
        }
    }
}

export { Checker }
