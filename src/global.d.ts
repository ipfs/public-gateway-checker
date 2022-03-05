/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable etc/prefer-interface */
// import { Tag } from './Tag'
// import * as ipfsHttpClient from 'ipfs-http-client'
// import type { Checker } from './Checker'

declare module '@dutu/rate-limiter'

// declare global {
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
  tag: import('./Tag').Tag
  _tagName: string
  _className: string
}

interface Window {
  IpfsHttpClient: typeof import('ipfs-http-client')
  IpfsGeoip: typeof import('ipfs-geoip')
  OnScriptloaded: typeof import('./onScriptLoaded').onScriptLoaded
  checker: import('./Checker').Checker
  client: ReturnValue<typeof import('ipfs-http-client').create>
}

declare namespace IpfsGeoip {
  interface LookupResponse {
    country_code: string
    country_name: string
  }
}
type DnsQueryResponseAnswer = { name: string, type: number, TTL: number, data: string }
type DnsQueryResponseQuestion = { name: string, type: number }

type DnsQueryResponseAuthority = {
  TTL: number
  data: string // "aragorn.ns.cloudflare.com. dns.cloudflare.com. 2271826322 10000 2400 604800 3600"
  name: string // "stibarc.com"
  type: number
}

interface DnsQueryResponse {
  AD: boolean
  Answer?: DnsQueryResponseAnswer[]
  Authority?: DnsQueryResponseAuthority[]
  CD: boolean
  Question: DnsQueryResponseQuestion[]
  RA: boolean
  RD: boolean
  Status: number
  TC: boolean
}
// }
