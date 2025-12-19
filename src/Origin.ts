import { URL } from 'url-ponyfill'
import { Log } from './Log.js'
import { Tag } from './Tag.js'
import { checkViaImgSrc } from './checkViaImgSrc.js'
import { IMG_HASH } from './constants.js'
import { expectSubdomainRedirect } from './expectSubdomainRedirect.js'
import type { GatewayNode } from './GatewayNode.js'

const log = new Log('Origin')

class Origin {
  tag: Tag
  constructor (public parent: GatewayNode) {
    this.tag = new Tag('div', 'Origin')
  }

  async check (): Promise<void> {
    // we are unable to check url after subdomain redirect because some gateways
    // may not have proper CORS in place. instead, we manually construct subdomain
    // URL and check if it loading known image works
    const gwUrl = new URL(this.parent.gateway)
    const imgSubdomainUrl = new URL(`${gwUrl.protocol}//${IMG_HASH}.ipfs.${gwUrl.hostname}/?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
    const imgRedirectedPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)

    // Use shared redirect detection result from parent
    const { confirmedTarget, possibleRedirect, errorStatus } = this.parent.redirectDetection

    // Track if subdomain check passed (for heuristic warning)
    let subdomainWorks = false

    await checkViaImgSrc(imgSubdomainUrl)
      .then(async () => {
        subdomainWorks = true
        return expectSubdomainRedirect(imgRedirectedPathUrl, this.parent.gateway)
      })
      .then(({ success, crossDomainRedirect, errorMessage }) => {
        if (!success) {
          // Subdomain test failed - show failure, not redirect
          log.debug(errorMessage)
          this.tag.lose()
          this.tag.title = errorMessage ?? 'Path gateway does not redirect to expected subdomain'
          return
        }
        if (crossDomainRedirect != null) {
          this.parent.crossDomainRedirect = crossDomainRedirect
          this.tag.redirect()
          this.tag.title = `Redirected to ${crossDomainRedirect}`
        } else {
          this.tag.win(imgSubdomainUrl.toString())
        }
        this.parent.tag.classList.add('origin')
      })
      .catch((err) => {
        // Only reaches here if fetch itself failed (network/CORS error)
        // Check detection results in priority order (redirect takes precedence over error)
        if (confirmedTarget != null) {
          this.tag.redirect()
          this.tag.title = `Redirected to ${confirmedTarget}`
        } else if (possibleRedirect) {
          this.parent.crossDomainRedirect = 'another gateway'
          this.tag.redirect()
          this.tag.title = 'HTTP redirect detected'
        } else if (errorStatus != null) {
          this.tag.lose()
          this.tag.title = `HTTP ${errorStatus} error`
        } else if (subdomainWorks) {
          // Subdomain works but path doesn't redirect to subdomain
          log.debug('Subdomain works but path does not redirect to subdomain')
          this.tag.lose()
          this.tag.title = 'Subdomain gateway works, but path gateway does not redirect to subdomain'
        } else {
          this.onerror(err)
        }
      })
  }

  onerror (err: Error): void {
    log.error(err)
    this.tag.lose()
    throw err
  }
}

export { Origin }
