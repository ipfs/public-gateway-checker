import { URL } from 'url-ponyfill';
import { Cors } from './Cors';
import { Flag } from './Flag';
import { IPNSCheck } from './Ipns';
import { Log } from './Log';
import { Origin } from './Origin';
import { Status } from './Status';
import { Trustless } from './Trustless';
import { UiComponent } from './UiComponent';
import { HASH_TO_TEST } from './constants';
import { gatewayHostname } from './gatewayHostname';
const log = new Log('GatewayNode');
class GatewayNode extends UiComponent /* implements Checkable */ {
    constructor(parent, gateway, index) {
        super(parent, 'div', 'Node');
        this.parent = parent;
        this.atLeastOneSuccess = false;
        this.tag.empty();
        this.tag.style.order = Date.now().toString();
        this.status = new Status(this);
        this.tag.append(this.status.tag);
        this.cors = new Cors(this);
        this.tag.append(this.cors.tag);
        this.ipns = new IPNSCheck(this);
        this.tag.append(this.ipns.tag);
        this.origin = new Origin(this);
        this.tag.append(this.origin.tag);
        this.trustless = new Trustless(this);
        this.tag.append(this.trustless.tag);
        this.link = document.createElement('div');
        const gatewayAndHash = gateway.replace(':hash', HASH_TO_TEST);
        this.link.url = new URL(gatewayAndHash);
        this.link.textContent = gatewayHostname(this.link.url);
        this.link.className = 'Link';
        this.flag = new Flag(this, this.link.textContent);
        // this.link.prepend(this.flag.tag.element)
        this.tag.append(this.flag.tag);
        this.tag.append(this.link);
        this.took = document.createElement('div');
        this.took.className = 'Took';
        this.tag.append(this.took);
        this.gateway = gateway;
        this.index = index;
        this.checkingTime = 0;
    }
    async check() {
        this.checkingTime = Date.now();
        // const onFailedCheck = () => { this.status.down = true }
        // const onSuccessfulCheck = () => { this.status.up = true }
        void this.flag.check().then(() => { log.debug(this.gateway, 'Flag success'); });
        const onlineChecks = [
            // this.flag.check().then(() => log.debug(this.gateway, 'Flag success')),
            this.status.check().then(() => { log.debug(this.gateway, 'Status success'); }).then(this.onSuccessfulCheck.bind(this)),
            this.cors.check().then(() => { log.debug(this.gateway, 'CORS success'); }).then(this.onSuccessfulCheck.bind(this)),
            this.ipns.check().then(() => { log.debug(this.gateway, 'IPNS success'); }).then(this.onSuccessfulCheck.bind(this)),
            this.origin.check().then(() => { log.debug(this.gateway, 'Origin success'); }).then(this.onSuccessfulCheck.bind(this)),
            this.trustless.check().then(() => { log.debug(this.gateway, 'Trustless success'); }).then(this.onSuccessfulCheck.bind(this))
        ];
        // we care only about the fastest method to return a success
        // Promise.race(onlineChecks).catch((err) => {
        //   log.error('Promise race error', err)
        // })
        // await Promise.all(onlineChecks).catch(onFailedCheck)
        await Promise.allSettled(onlineChecks).then((results) => results.map((result) => {
            return result.status;
        })).then((statusArray) => {
            if (statusArray.includes('fulfilled')) {
                // At least promise was successful, which means the gateway is online
                log.debug(`For gateway '${this.gateway}', at least one promise was successfully fulfilled`);
                log.debug(this.gateway, 'this.status.up: ', this.status.up);
                log.debug(this.gateway, 'this.status.down: ', this.status.down);
                this.status.up = true;
                log.debug(this.gateway, 'this.status.up: ', this.status.up);
                log.debug(this.gateway, 'this.status.down: ', this.status.down);
            }
            else {
                // No promise was successful, the gateway is down.
                this.status.down = true;
                log.debug(`For gateway '${this.gateway}', all promises were rejected`);
            }
        });
    }
    onSuccessfulCheck() {
        if (!this.atLeastOneSuccess) {
            log.info(`For gateway '${this.gateway}', at least one check was successful`);
            this.atLeastOneSuccess = true;
            this.status.up = true;
            const url = this.link.url;
            if (url != null) {
                const host = gatewayHostname(url);
                // const anchor = document.createElement('a')
                // anchor.title = host
                // anchor.href = `${url.toString()}#x-ipfs-companion-no-redirect`
                // anchor.target = '_blank'
                // anchor.textContent = host
                // this.flag.tag.element.remove()
                // this.link.textContent = ''
                // this.link.append(this.flag.tag.element, anchor)
                this.link.innerHTML = `<a title="${host}" href="${url.toString()}#x-ipfs-companion-no-redirect" target="_blank">${host}</a>`;
            }
            const ms = Date.now() - this.checkingTime;
            this.tag.style.order = ms.toString();
            const s = (ms / 1000).toFixed(2);
            this.took.textContent = `${s}s`;
        }
    }
    // private checked () {
    //   if (!this.doneChecking) {
    //     this.doneChecking = true
    //     // this.status.checked()
    //     // this.parent.checked()
    //   } else {
    //     log.warn('"checked" method called more than once.. potential logic error')
    //   }
    // }
    onerror() {
        this.tag.err();
    }
}
export { GatewayNode };
//# sourceMappingURL=GatewayNode.js.map