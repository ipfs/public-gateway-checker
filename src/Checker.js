import { GatewayNode } from './GatewayNode';
import { Log } from './Log';
import { Results } from './Results';
import { Stats } from './Stats';
const log = new Log('Checker');
class Checker {
    constructor() {
        this.nodes = [];
        const element = document.getElementById('checker');
        if (element == null) {
            throw new Error('Element with Id "checker" not found.');
        }
        this.element = element;
        this.stats = new Stats(this);
        this.results = new Results(this);
        this.updateStats = this.updateStats.bind(this);
    }
    updateStats() {
        this.stats.update();
    }
    async checkGateways(gateways) {
        const allChecks = [];
        for (const gateway of gateways) {
            const node = new GatewayNode(this.results, gateway, this.nodes.length);
            this.nodes.push(node);
            this.results.append(node.tag);
            // void node.check()
            setTimeout(() => {
                allChecks.push(node.check().catch((err) => { log.error(err); }).finally(this.updateStats));
            }, 100 * this.nodes.length);
        }
        // await Promise.all(allChecks).finally(this.updateStats)
    }
}
export { Checker };
//# sourceMappingURL=Checker.js.map