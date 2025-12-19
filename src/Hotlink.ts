import { URL } from 'url-ponyfill'
import { CheckBase } from './CheckBase.js'
import { Log } from './Log.js'
import { checkViaImgSrc } from './checkViaImgSrc.js'
import { IMG_HASH } from './constants.js'
import type { GatewayNode } from './GatewayNode.js'
import type { Checkable } from './types.js'

const log = new Log('Hotlink')

class Hotlink extends CheckBase implements Checkable {
  _className = 'Hotlink'
  _tagName = 'div'
  constructor (protected parent: GatewayNode) {
    super(parent, 'div', 'Hotlink')
  }

  // Hotlink test is optimized for speed - no redirect detection.
  // Other tests (CORS, IPNS, etc.) detect redirects and update Status.
  async check (): Promise<void> {
    const gwUrl = new URL(this.parent.gateway)
    const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)

    try {
      await checkViaImgSrc(imgPathUrl)
      this.tag.win()
    } catch (err) {
      log.error(err)
      this.onerror()
      throw err
    }
  }

  checked (): void {
    log.warn('Not implemented yet')
  }

  onerror (): void {
    this.tag.lose()
    this.tag.title = 'Failed to load image via path gateway'
  }
}

export { Hotlink }
