import fetchPonyfill from 'fetch-ponyfill'
import { CheckBase } from './CheckBase'
import { Log } from './Log'
import { IPNS_PATH_TO_TEST } from './constants'
import type { GatewayNode } from './GatewayNode'
import type { Checkable } from './types'

const { fetch } = fetchPonyfill()

const log = new Log('Ipns')

class IPNSCheck extends CheckBase implements Checkable {
  _className = 'Ipns'
  _tagName = 'div'
  constructor (protected parent: GatewayNode) {
    super(parent, 'div', 'Ipns')
  }

  async check (): Promise<void> {
    const now = Date.now()
    // Since gateway URLs are hard coded with /ipfs/, we need to parse URLs and override the path to /ipns/.
    const gatewayUrl = new URL(this.parent.gateway)
    gatewayUrl.pathname = IPNS_PATH_TO_TEST
    const testUrl = `${gatewayUrl.href}?now=${now}#x-ipfs-companion-no-redirect`
    try {
      const response = await fetch(testUrl)
      if (response.status === 200) {
        this.tag.win()
      } else {
        log.debug(`${this.parent.gateway} does not support IPNS`)
        throw new Error(`URL '${testUrl} is not reachable`)
      }
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
    this.tag.err()
  }
}

export { IPNSCheck }
