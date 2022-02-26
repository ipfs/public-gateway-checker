import fetchPonyfill from 'fetch-ponyfill'

import { CheckBase } from './CheckBase'
import type { GatewayNode } from './GatewayNode'
import { Util } from './Util'
import { Log } from './Log'

const { fetch } = fetchPonyfill()

const log = new Log('Cors')

// let Cors = function(parent) {
//   this.parent = parent;
//   this.tag = document.createElement("div");
//   this.tag.className = "Cors";
//   this.tag.textContent = '🕑';
// };
class Cors extends CheckBase implements Checkable {
  _className = 'Cors'
  _tagName = 'div'
  constructor (protected parent: GatewayNode) {
    super(parent, 'div', 'Cors')
    // this.tag = new Tag('div', 'Cors')
    //   this.parent = parent;
    //   this.tag = document.createElement("div");
    //   this.tag.className = "Cors";
    //   this.tag.textContent = '🕑';
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
  check () {
    const now = Date.now()
    const gatewayAndHash = this.parent.gateway.replace(':hash', Util.HASH_TO_TEST)
    const testUrl = `${gatewayAndHash}?now=${now}#x-ipfs-companion-no-redirect`
    // response body can be accessed only if fetch was executed when
    // liberal CORS is present (eg. '*')
    fetch(testUrl).then(async (res) => await res.text()).then((text) => {
      const matched = (Util.HASH_STRING === text.trim())
      if (matched) {
        this.parent.checked()
        // this.tag.textContent = '*'
        this.tag.asterisk()
        this.parent.tag.classList.add('cors')
      } else {
        this.onerror()
      }
    }).catch((err) => {
      log.error(err)
      this.onerror()
    })
  }

  checked () {
    log.warn('Not implemented yet')
  }

  // Cors.prototype.onerror = function() {
  //     this.tag.textContent = '';
  // };
  onerror () {
    // this.tag.textContent = ''
    this.tag.err()
  }
}

export { Cors }
