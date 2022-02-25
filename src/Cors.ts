
// let Cors = function(parent) {
// 	this.parent = parent;
// 	this.tag = document.createElement("div");
// 	this.tag.className = "Cors";
// 	this.tag.textContent = '🕑';

import { Check } from './global';
import { Tag } from './Tag';

// };
class Cors implements Check {
    tag: Tag;
    constructor() {
        this.tag = new Tag('div', 'Cors')
        // 	this.parent = parent;
        // 	this.tag = document.createElement("div");
        // 	this.tag.className = "Cors";
        // 	this.tag.textContent = '🕑';
    }

    // Cors.prototype.check = function() {
    //   const now = Date.now()
    //   const gatewayAndHash = this.parent.gateway.replace(':hash', HASH_TO_TEST)
    //   const testUrl = `${gatewayAndHash}?now=${now}#x-ipfs-companion-no-redirect`
    //   // response body can be accessed only if fetch was executed when
    //   // liberal CORS is present (eg. '*')
    //   fetch(testUrl).then((res) => res.text()).then((text) => {
    //     const matched = (HASH_STRING === text.trim())
    //     if (matched) {
    //       this.parent.checked()
    //       this.tag.textContent = '*'
    //       this.parent.tag.classList.add('cors')
    //     } else {
    //       this.onerror()
    //     }
    //   }).catch((err) => this.onerror())
    // }
    check() {
        const now = Date.now()
        const gatewayAndHash = this.parent.gateway.replace(':hash', HASH_TO_TEST)
        const testUrl = `${gatewayAndHash}?now=${now}#x-ipfs-companion-no-redirect`
        // response body can be accessed only if fetch was executed when
        // liberal CORS is present (eg. '*')
        fetch(testUrl).then((res) => res.text()).then((text) => {
            const matched = (HASH_STRING === text.trim())
            if (matched) {
            this.parent.checked()
            this.tag.textContent = '*'
            this.parent.tag.classList.add('cors')
            } else {
            this.onerror()
            }
        }).catch((err) => this.onerror())
    }

    checked() {
        console.warn('Not implemented yet')
    }

    // Cors.prototype.onerror = function() {
    //     this.tag.textContent = '';
    // };
    private onerror () {
        this.tag.textContent = '';
    };

}

export { Cors }
