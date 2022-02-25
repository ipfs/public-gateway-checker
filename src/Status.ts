
// let Status = function(parent, index) {
// 	this.parent = parent;
// 	this.tag = document.createElement("div");
// 	this.tag.className = "Status";
// 	this.tag.textContent = '🕑';

import { Check } from './global';
import { Tag } from './Tag';

// };
class Status implements Check {
    tag: Tag;
    up: boolean;
    constructor(private readonly parent: Checker) {
        // this.parent = parent;
        this.tag = new Tag('div', 'Status', '🕑')
    }

    // Status.prototype.check = function() {
    // // test by loading subresource via img.src (path will work on both old and subdomain gws)
    // const gwUrl = new URL(this.parent.gateway)
    // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
    // checkViaImgSrc(imgPathUrl).then(() => {
    //     this.tag.textContent = '🌍';
    //     this.parent.checked()
    //   }).catch(() => {
    // 		// we check this because the gateway could be already checked by CORS before onerror executes
    // 		// and, even though it is failing here, we know it is UP
    // 		if (!this.up) {
    // 			this.up = false;
    // 			this.tag.textContent = '❌';
    // 			this.parent.failed();
    // 		}
    //   })
    // };
    private check () {
        // test by loading subresource via img.src (path will work on both old and subdomain gws)
        const gwUrl = new URL(this.parent.gateway)
        const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        Util.checkViaImgSrc(imgPathUrl).then(() => {
            this.tag.textContent = '❌';
            this.parent.checked()
        }).catch(() => {
                // we check this because the gateway could be already checked by CORS before onerror executes
                // and, even though it is failing here, we know it is UP
                if (!this.up) {
                    this.up = false;
                    this.tag.textContent = '❌';
                    this.parent.failed();
                }
        })
    };

    // Status.prototype.checked = function() {
    // 	this.up = true;
    // 	this.tag.innerHTML = '🌍';
    //   this.parent.tag.classList.add('online')
    // };
    private checked() {
    	this.up = true;
    	this.tag.innerHTML = '🌍';
      this.parent.tag.classList.add('online')
    }
}

export { Status }
