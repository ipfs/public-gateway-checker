// let Origin = function(parent) {
// 	this.parent = parent;
// 	this.tag = document.createElement("div");
// 	this.tag.className = "Origin";
// 	this.tag.textContent = '🕑';

import { CheckBase } from './CheckBase';
import { Checker } from './Checker';
import { Tag } from './Tag';

// };
class Origin extends CheckBase {
    constructor(parent: Checker) {
        super(parent)
        this.tag = new Tag('div', 'Origin')
    }

// Origin.prototype.check = function() {
// // we are unable to check url after subdomain redirect because some gateways
// // may not have proper CORS in place. instead, we manually construct subdomain
// // URL and check if it loading known image works
// const gwUrl = new URL(this.parent.gateway)
// // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${now}&filename=1x1.png#x-ipfs-companion-no-redirect`)
// const imgSubdomainUrl = new URL(`${gwUrl.protocol}//${IMG_HASH}.ipfs.${gwUrl.hostname}/?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
// const imgRedirectedPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
// checkViaImgSrc(imgSubdomainUrl)
//   .then(() => expectSubdomainRedirect(imgRedirectedPathUrl)
//   .then(() => {
//     this.tag.textContent = '✅';
//     this.parent.tag.classList.add('origin')
//     this.parent.checked()
//   }))
//   .catch(() => this.onerror())
// }
    check () {
        // we are unable to check url after subdomain redirect because some gateways
        // may not have proper CORS in place. instead, we manually construct subdomain
        // URL and check if it loading known image works
        const gwUrl = new URL(this.parent.gateway)
        // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${now}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        const imgSubdomainUrl = new URL(`${gwUrl.protocol}//${IMG_HASH}.ipfs.${gwUrl.hostname}/?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        const imgRedirectedPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        checkViaImgSrc(imgSubdomainUrl)
        .then(() => expectSubdomainRedirect(imgRedirectedPathUrl)
        .then(() => {
            this.tag.textContent = '✅';
            this.parent.tag.classList.add('origin')
            this.parent.checked()
        }))
        .catch(() => this.onerror())
    }

}

export { Origin }
