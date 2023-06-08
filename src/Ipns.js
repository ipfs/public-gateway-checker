import fetchPonyfill from 'fetch-ponyfill';
import { CheckBase } from './CheckBase';
import { Log } from './Log';
import { IPNS_PATH_TO_TEST } from './constants';
const { fetch } = fetchPonyfill();
const log = new Log('Ipns');
class IPNSCheck extends CheckBase {
    constructor(parent) {
        super(parent, 'div', 'Ipns');
        this.parent = parent;
        this._className = 'Ipns';
        this._tagName = 'div';
    }
    async check() {
        const now = Date.now();
        // Since gateway URLs are hard coded with /ipfs/, we need to parse URLs and override the path to /ipns/.
        const gatewayUrl = new URL(this.parent.gateway);
        gatewayUrl.pathname = IPNS_PATH_TO_TEST;
        const testUrl = `${gatewayUrl.href}?now=${now}#x-ipfs-companion-no-redirect`;
        try {
            const response = await fetch(testUrl);
            if (response.status === 200) {
                this.tag.win();
            }
            else {
                log.debug(`${this.parent.gateway} does not support IPNS`);
                throw new Error(`URL '${testUrl} is not reachable`);
            }
        }
        catch (err) {
            log.error(err);
            this.onerror();
            throw err;
        }
    }
    checked() {
        log.warn('Not implemented yet');
    }
    onerror() {
        this.tag.err();
    }
}
export { IPNSCheck };
//# sourceMappingURL=Ipns.js.map