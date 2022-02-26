import { URL } from 'url-ponyfill'

import type { GatewayNode } from './GatewayNode'
import { UiComponent } from './UiComponent'
import { Util } from './Util'

// let Status = function(parent, index) {
//   this.parent = parent;
//   this.tag = document.createElement("div");
//   this.tag.className = "Status";
//   this.tag.textContent = '🕑';
// };
class Status extends UiComponent {
  up: boolean = false
  constructor (readonly parent: GatewayNode) {
    super(parent, 'div', 'Status')
    // this.parent = parent;
    // this.tag = new Tag('div', 'Status')
  }

  // Status.prototype.check = function() {
  // // test by loading subresource via img.src (path will work on both old and subdomain gws)
  // const gwUrl = new URL(this.parent.gateway)
  // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
  // checkViaImgSrc(imgPathUrl).then(() => {
  //     this.tag.textContent = '🌍';
  //     this.parent.checked()
  //   }).catch(() => {
  //     // we check this because the gateway could be already checked by CORS before onerror executes
  //     // and, even though it is failing here, we know it is UP
  //     if (!this.up) {
  //       this.up = false;
  //       this.tag.textContent = '❌';
  //       this.parent.failed();
  //     }
  //   })
  // };
  check () {
    // test by loading subresource via img.src (path will work on both old and subdomain gws)
    const gwUrl = new URL(this.parent.gateway)
    const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${Util.IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
    Util.checkViaImgSrc(imgPathUrl).then(() => {
      // this.tag.textContent = '❌'
      this.tag.lose()
      this.parent.checked()
    }).catch(() => {
      // we check this because the gateway could be already checked by CORS before onerror executes
      // and, even though it is failing here, we know it is UP
      if (!this.up) {
        this.up = false
        // this.tag.textContent = '❌'
        this.tag.lose()
        this.parent.failed()
      }
    })
  }

  // Status.prototype.checked = function() {
  //   this.up = true;
  //   this.tag.innerHTML = '🌍';
  //   this.parent.tag.classList.add('online')
  // };
  checked () {
    this.up = true
    // this.tag.innerHTML = '🌍'
    this.tag.global()
    this.parent.tag.classList.add('online')
  }

  onerror () {
    throw new Error('Not implemented')
  }
}

export { Status }
