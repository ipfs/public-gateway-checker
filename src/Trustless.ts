import fetchPonyfill from 'fetch-ponyfill'
import { CheckBase } from './CheckBase.js'
import { Log } from './Log.js'
import { checkCrossDomainRedirect } from './checkCrossDomainRedirect.js'
import { HASH_TO_TEST, TRUSTLESS_RESPONSE_TYPES } from './constants.js'
import type { GatewayNode } from './GatewayNode.js'
import type { Checkable } from './types.js'

const { fetch } = fetchPonyfill()

const log = new Log('Trustless')

class Trustless extends CheckBase implements Checkable {
  _className = 'Trustless'
  _tagName = 'div'
  constructor (protected parent: GatewayNode) {
    super(parent, 'div', 'Trustless')
  }

  async check (): Promise<void> {
    const now = Date.now()
    const gatewayAndHash = `${this.parent.gateway}/ipfs/${HASH_TO_TEST}`
    this.parent.tag.classList.add('trustless')

    // Use shared redirect detection result from parent
    const { confirmedTarget, possibleRedirect, errorStatus } = this.parent.redirectDetection
    let redirectTarget = confirmedTarget

    try {
      const trustlessResponseTypesTests = await Promise.all(TRUSTLESS_RESPONSE_TYPES.map(
        async (trustlessTypes): Promise<boolean> => {
          const testUrl = `${gatewayAndHash}?format=${trustlessTypes}&now=${now}#x-ipfs-companion-no-redirect`
          const response = await fetch(testUrl)
          const redirect = checkCrossDomainRedirect(response.url, this.parent.gateway)
          if (redirect != null) {
            redirectTarget = redirect
            this.parent.crossDomainRedirect = redirect
          }
          return Boolean(response.headers.get('Content-Type')?.includes(`application/vnd.ipld.${trustlessTypes}`))
        }
      ))

      const failedTests = TRUSTLESS_RESPONSE_TYPES.filter((_result, idx) => !trustlessResponseTypesTests[idx])

      if (failedTests.length === 0) {
        if (redirectTarget != null) {
          this.tag.redirect()
          this.tag.title = `Redirected to ${redirectTarget}`
        } else {
          this.tag.win()
        }
        return
      }
      // Format tests failed - don't throw (catch is for fetch failures)
      const errorMsg = `Missing ?format= types: [${failedTests.join(', ')}]`
      log.debug(errorMsg)
      this.tag.lose()
      this.tag.title = errorMsg
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
    this.tag.title = 'Trustless fetch failed'
  }
}

export { Trustless }
