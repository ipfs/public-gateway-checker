import fetchPonyfill from 'fetch-ponyfill'
import { CheckBase } from './CheckBase.js'
import { Log } from './Log.js'
import { checkCrossDomainRedirect } from './checkCrossDomainRedirect.js'
import { IPNS_PATH_TO_TEST } from './constants.js'
import type { GatewayNode } from './GatewayNode.js'
import type { Checkable } from './types.js'

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

    // Use shared redirect detection result from parent
    const { confirmedTarget, possibleRedirect, errorStatus } = this.parent.redirectDetection
    let redirectTarget = confirmedTarget

    try {
      const response = await fetch(testUrl)
      // Also check response.url for redirects that CORS allows
      const redirect = checkCrossDomainRedirect(response.url, this.parent.gateway)
      if (redirect != null) {
        redirectTarget = redirect
        this.parent.crossDomainRedirect = redirect
      }
      if (response.status === 200) {
        if (redirectTarget != null) {
          this.tag.redirect()
          this.tag.title = `Redirected to ${redirectTarget}`
        } else {
          this.tag.win()
        }
        return
      }
      // Non-200 status - test failed, don't throw (catch is for fetch failures)
      log.debug(`${this.parent.gateway} does not support IPNS`)
      this.onerror()
    } catch (err) {
      // Only reaches here if fetch itself failed (network/CORS error)
      log.error(err)
      // Check detection results in priority order (redirect takes precedence over error)
      if (redirectTarget != null) {
        this.tag.redirect()
        this.tag.title = `Redirected to ${redirectTarget}`
      } else if (possibleRedirect) {
        this.parent.crossDomainRedirect = 'another gateway'
        this.tag.redirect()
        this.tag.title = 'HTTP redirect detected'
      } else if (errorStatus != null) {
        this.tag.lose()
        this.tag.title = `HTTP ${errorStatus} error`
      } else {
        this.onerror()
      }
      throw err
    }
  }

  checked (): void {
    log.warn('Not implemented yet')
  }

  onerror (): void {
    this.tag.lose()
    this.tag.title = 'IPNS resolution failed (non-200 response)'
  }
}

export { IPNSCheck }
