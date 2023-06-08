import { URL } from 'url-ponyfill';
import { Log } from './Log';
import { UiComponent } from './UiComponent';
import { checkViaImgSrc } from './checkViaImgSrc';
import { IMG_HASH } from './constants';
const log = new Log('Status');
class Status extends UiComponent {
    constructor(parent) {
        super(parent, 'div', 'Status');
        this.parent = parent;
        this._up = false;
        this._down = false;
    }
    async check() {
        // test by loading subresource via img.src (path will work on both old and subdomain gws)
        const gwUrl = new URL(this.parent.gateway);
        const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`);
        await checkViaImgSrc(imgPathUrl).catch((err) => {
            if (err != null) {
                log.error(this.parent.gateway, err);
            }
            // this.down = true
            // we check this because the gateway could be already checked by CORS before onerror executes
            // and, even though it is failing here, we know it is UP
            // if (!this.up) {
            //   this.down = false
            //   // this.tag.textContent = '❌'
            //   this.tag.lose()
            //   // this.parent.failed()
            // }
            throw err;
        });
    }
    get down() {
        return this._down;
    }
    set down(value) {
        if (!this.up && !this.down) {
            this._down = true;
            this.tag.lose();
        }
    }
    get up() {
        return this._up;
    }
    set up(value) {
        if (!this.up && !this.down) {
            this._up = true;
            this.tag.global();
            this.parent.tag.classList.add('online');
        }
    }
    // checked () {
    //   // this.up = true
    //   // this.tag.global()
    // }
    onerror() {
        throw new Error('Not implemented');
    }
}
export { Status };
//# sourceMappingURL=Status.js.map