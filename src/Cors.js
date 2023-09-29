import fetchPonyfill from 'fetch-ponyfill';
import { CheckBase } from './CheckBase';
import { Log } from './Log';
import { HASH_STRING, HASH_TO_TEST } from './constants';
const { fetch } = fetchPonyfill();
const log = new Log('Cors');
class Cors extends CheckBase {
    parent;
    _className = 'Cors';
    _tagName = 'div';
    constructor(parent) {
        super(parent, 'div', 'Cors');
        this.parent = parent;
    }
    async check() {
        const now = Date.now();
        const gatewayAndHash = `${this.parent.gateway}/ipfs/${HASH_TO_TEST}`;
        const testUrl = `${gatewayAndHash}?now=${now}#x-ipfs-companion-no-redirect`;
        // response body can be accessed only if fetch was executed when
        // liberal CORS is present (eg. '*')
        try {
            const response = await fetch(testUrl);
            const { status } = response;
            const text = await response.text();
            this.tag.title = `Response code: ${status}`;
            if (HASH_STRING === text.trim()) {
                // this.parent.checked()
                this.tag.asterisk();
                this.parent.tag.classList.add('cors');
            }
            else {
                log.debug('The response text did not match the expected string');
                this.onerror();
                throw new Error(`URL '${testUrl} does not support CORS`);
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
        this.tag.empty();
    }
}
export { Cors };
//# sourceMappingURL=Cors.js.map