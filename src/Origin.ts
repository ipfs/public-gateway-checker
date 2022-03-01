import { URL } from 'url-ponyfill'

import type { GatewayNode } from './GatewayNode'
import { Tag } from './Tag'
import { Util } from './Util'

class Origin {
  tag: Tag
  constructor (public parent: GatewayNode) {
    this.tag = new Tag('div', 'Origin')
  }

  check () {
    // we are unable to check url after subdomain redirect because some gateways
    // may not have proper CORS in place. instead, we manually construct subdomain
    // URL and check if it loading known image works
    const gwUrl = new URL(this.parent.gateway)
    // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${now}&filename=1x1.png#x-ipfs-companion-no-redirect`)
    const imgSubdomainUrl = new URL(`${gwUrl.protocol}//${Util.IMG_HASH}.ipfs.${gwUrl.hostname}/?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
    const imgRedirectedPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${Util.IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
    Util.checkViaImgSrc(imgSubdomainUrl)
      .then(async () => await Util.expectSubdomainRedirect(imgRedirectedPathUrl)
        .then(() => {
          this.tag.win()
          this.parent.tag.classList.add('origin')
          this.parent.checked()
        }))
      .catch(() => this.onerror())
  }

  onerror () {
    this.tag.err()
  }
}

export { Origin }
