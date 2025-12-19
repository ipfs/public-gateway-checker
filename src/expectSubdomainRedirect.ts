import { URL } from 'url-ponyfill'
import { Log } from './Log.js'
import { checkCrossDomainRedirect } from './checkCrossDomainRedirect.js'
import { IMG_HASH } from './constants.js'

const log = new Log('expectSubdomainRedirect')

interface SubdomainRedirectResult {
  success: boolean
  crossDomainRedirect: string | null
  errorMessage?: string
}

async function expectSubdomainRedirect (url: string | URL, gatewayUrl: string): Promise<SubdomainRedirectResult> {
  // Detecting redirects on remote Origins is extra tricky,
  // but we seem to be able to access xhr.responseURL which is enough to see
  // if paths are redirected to subdomains.

  const { redirected, url: responseUrl } = await fetch(url.toString())
  log.debug('redirected: ', redirected)
  log.debug('responseUrl: ', responseUrl)

  if (redirected) {
    log.debug('definitely redirected')
  }
  const { hostname } = new URL(responseUrl)

  const crossDomainRedirect = checkCrossDomainRedirect(responseUrl, gatewayUrl)

  if (!hostname.startsWith(IMG_HASH)) {
    const msg = `Expected ${url.toString()} to redirect to subdomain '${IMG_HASH}' but instead received '${responseUrl}'`
    log.debug(msg)
    return { success: false, crossDomainRedirect, errorMessage: msg }
  }

  return { success: true, crossDomainRedirect }
}

export { expectSubdomainRedirect }
