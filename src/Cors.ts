import fetchPonyfill from 'fetch-ponyfill'
import { CheckBase } from './CheckBase.js'
import { Log } from './Log.js'
import { checkCrossDomainRedirect } from './checkCrossDomainRedirect.js'
import { HASH_STRING, HASH_TO_TEST } from './constants.js'
import type { GatewayNode } from './GatewayNode.js'
import type { Checkable } from './types.js'

const { fetch } = fetchPonyfill()

const log = new Log('Cors')

class Cors extends CheckBase implements Checkable {
  _className = 'Cors'
  _tagName = 'div'
  constructor (protected parent: GatewayNode) {
    super(parent, 'div', 'Cors')
  }

  async check (): Promise<void> {
    const now = Date.now()
    const gatewayAndHash = `${this.parent.gateway}/ipfs/${HASH_TO_TEST}`
    const testUrl = `${gatewayAndHash}?now=${now}#x-ipfs-companion-no-redirect`

    // Use shared redirect detection result from parent
    const { confirmedTarget, possibleRedirect, errorStatus } = this.parent.redirectDetection
    let redirectTarget = confirmedTarget

    // response body can be accessed only if fetch was executed when
    // liberal CORS is present (eg. '*')
    try {
      const response = await fetch(testUrl)
      const { status } = response
      // Also check response.url for redirects that CORS allows
      const redirect = checkCrossDomainRedirect(response.url, this.parent.gateway)
      if (redirect != null) {
        redirectTarget = redirect
        this.parent.crossDomainRedirect = redirect
      }
      const text = await response.text()
      this.tag.title = redirectTarget != null
        ? `Response code: ${status}, redirected to ${redirectTarget}`
        : `Response code: ${status}`
      if (HASH_STRING === text.trim()) {
        this.tag.win()
        this.parent.tag.classList.add('cors')
        return
      }
      // Content mismatch - test failed, don't throw (catch is for fetch failures)
      log.debug('The response text did not match the expected string')
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
    this.tag.title = 'CORS fetch failed or content mismatch'
  }
}

export { Cors }
