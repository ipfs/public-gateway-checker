import { Tag } from './Tag';
import { UiComponent } from './UiComponent';
class Stats extends UiComponent {
    parent;
    gateways;
    totals;
    constructor(parent) {
        super(parent);
        this.parent = parent;
        const statsElement = document.getElementById('checker.stats');
        if (statsElement == null) {
            throw new Error('Could not find element with Id "checker.stats"');
        }
        this.tag = Tag.fromElement(statsElement);
        this.gateways = document.createElement('div');
        this.gateways.textContent = '0/0 tested';
        this.gateways.className = 'Gateways';
        this.tag.append(this.gateways);
        this.totals = document.createElement('div');
        this.totals.textContent = '0 online';
        this.totals.className = 'Totals';
        this.tag.append(this.totals);
    }
    update() {
        let up = 0;
        let down = 0;
        for (const savedNode of this.parent.nodes) {
            if (savedNode.status.up) {
                up += 1;
            }
            else if (savedNode.status.down) {
                down += 1;
            }
        }
        this.gateways.textContent = `${up + down}/${this.parent.nodes.length} tested`;
        this.totals.textContent = `${up} online`;
    }
}
export { Stats };
//# sourceMappingURL=Stats.js.map