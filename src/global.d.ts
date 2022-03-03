import { Tag } from './Tag'
import * as ipfsHttpClient from 'ipfs-http-client'
import type { Checker } from './Checker'

declare global {
  /**
   * An interface that allows various properties for gateways to be checked
   */
  interface Checkable {

    // @todo: Update to async/await
    // check: () => Promise<void>
    check: () => void
    checked: () => void

    onerror: () => void
  }

  /**
   * A class implementing the Visible interface supports functionality that can make it visible in the UI
   */
  interface Visible {
    tag: Tag
    _tagName: string
    _className: string
  }

  interface Window {
    IpfsHttpClient: typeof ipfsHttpClient
    IpfsGeoip: typeof import('ipfs-geoip')
    OnScriptloaded: import('./onScriptLoaded').onScriptLoaded
    checker: Checker
  }

  namespace IpfsGeoip {
    interface LookupResponse {
      country_code: string
      country_name: string
    }
  }
}
