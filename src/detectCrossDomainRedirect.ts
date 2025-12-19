import { URL } from 'url-ponyfill'

/**
 * Result of redirect detection.
 */
interface RedirectDetectionResult {
  /** Known target domain (from Location header), null if unknown */
  confirmedTarget: string | null
  /** True if opaqueredirect detected (redirect occurred but can't read Location) */
  possibleRedirect: boolean
  /** HTTP error status code (4XX/5XX) if detected */
  errorStatus: number | null
}

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
 * Detects cross-domain redirect by fetching with redirect: 'manual'.
 *
 * Returns:
 * - confirmedTarget: The redirect target domain if we can read Location header
 * - possibleRedirect: True if opaqueredirect detected (redirect occurred)
 *
 * Use the heuristic: opaqueredirect + CORS failure = cross-domain redirect
 * (subdomain redirects like dweb.link → *.ipfs.dweb.link succeed with CORS)
 */
async function detectCrossDomainRedirect (testUrl: string, gatewayUrl: string): Promise<RedirectDetectionResult> {
  const result: RedirectDetectionResult = { confirmedTarget: null, possibleRedirect: false, errorStatus: null }
  const gatewayHost = new URL(gatewayUrl).hostname

  // Must use native fetch - fetch-ponyfill may not preserve response.type
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
    return result
  }

  try {
    const response = await window.fetch(testUrl, { method: 'HEAD', redirect: 'manual' })

    // Check for opaqueredirect (cross-origin redirect, can't read Location)
    if (response.type === 'opaqueredirect') {
      result.possibleRedirect = true
    }

    // For same-origin redirect, we can read the Location header
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location')
      if (location != null) {
        const redirectHost = getBaseDomain(new URL(location, gatewayUrl).hostname)
        if (!redirectHost.endsWith(gatewayHost)) {
          // Cross-domain redirect - set both flags
          result.confirmedTarget = redirectHost
          result.possibleRedirect = true
        }
        // Same-domain redirect (e.g., to subdomain): leave possibleRedirect = false
      } else {
        // Redirect without Location header - unknown destination
        result.possibleRedirect = true
      }
    }

    // Detect error status codes (4XX/5XX)
    if (response.status >= 400) {
      result.errorStatus = response.status
    }
  } catch {
    // redirect: 'manual' failed - could be redirect without CORS headers OR offline/broken gateway
    // Try regular fetch - might work if redirect goes to CORS-enabled target, or detect error status
    try {
      const response = await window.fetch(testUrl, { method: 'HEAD' })
      // Got a CORS-enabled response - check status and URL
      if (response.status >= 400) {
        result.errorStatus = response.status
        return result // Error response, not a redirect
      }
      // Check if we were redirected cross-domain
      const finalHost = getBaseDomain(new URL(response.url).hostname)
      if (!finalHost.endsWith(gatewayHost)) {
        result.confirmedTarget = finalHost
        result.possibleRedirect = true
      }
    } catch {
      // Regular fetch also failed (CORS error or network)
      // Try no-cors with redirect: manual as last resort
      // This returns 'opaqueredirect' for actual redirects, 'opaque' for success
      try {
        const noCorsResponse = await window.fetch(testUrl, {
          method: 'HEAD',
          redirect: 'manual',
          mode: 'no-cors'
        })
        // opaqueredirect means server returned a redirect (3xx)
        // opaque means server returned success (2xx) - not a redirect
        if (noCorsResponse.type === 'opaqueredirect') {
          result.possibleRedirect = true
        }
      } catch {
        // Even no-cors failed - likely network error or server down
      }
    }
  }
  return result
}

export { detectCrossDomainRedirect }
export type { RedirectDetectionResult }
