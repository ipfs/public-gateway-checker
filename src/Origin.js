import { URL } from 'url-ponyfill';
import { Log } from './Log';
import { Tag } from './Tag';
import { checkViaImgSrc } from './checkViaImgSrc';
import { IMG_HASH } from './constants';
import { expectSubdomainRedirect } from './expectSubdomainRedirect';
const log = new Log('Origin');
class Origin {
    constructor(parent) {
        this.parent = parent;
        this.tag = new Tag('div', 'Origin');
    }
    async check() {
        // we are unable to check url after subdomain redirect because some gateways
        // may not have proper CORS in place. instead, we manually construct subdomain
        // URL and check if it loading known image works
        const gwUrl = new URL(this.parent.gateway);
        // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${now}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        const imgSubdomainUrl = new URL(`${gwUrl.protocol}//${IMG_HASH}.ipfs.${gwUrl.hostname}/?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`);
        const imgRedirectedPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`);
        await checkViaImgSrc(imgSubdomainUrl)
            .then(async () => expectSubdomainRedirect(imgRedirectedPathUrl))
            .then(() => {
            this.tag.win(imgSubdomainUrl.toString());
            this.parent.tag.classList.add('origin');
            // this.parent.checked()
        })
            .catch((err) => { this.onerror(err); });
    }
    onerror(err) {
        log.error(err);
        this.tag.err();
        throw err;
    }
}
export { Origin };
//# sourceMappingURL=Origin.js.map