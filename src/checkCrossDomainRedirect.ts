import { URL } from 'url-ponyfill'

/**
 * Strips *.ipfs. or *.ipns. subdomain prefix to get the base gateway domain.
 * e.g., "bafyxyz.ipfs.dweb.link" -> "dweb.link"
 */
function getBaseDomain (hostname: string): string {
  const match = hostname.match(/^.+\.(ipfs|ipns)\.(.+)$/)
  if (match != null) {
    return match[2]
  }
  return hostname
}

/**
 * Checks if a response URL indicates a cross-domain redirect.
 * Returns the target base domain if redirect detected, null otherwise.
 */
function checkCrossDomainRedirect (responseUrl: string, gatewayUrl: string): string | null {
  const gatewayHost = new URL(gatewayUrl).hostname
  const finalHost = getBaseDomain(new URL(responseUrl).hostname)
  if (!finalHost.endsWith(gatewayHost)) {
    return finalHost
  }
  return null
}

export { checkCrossDomainRedirect }
