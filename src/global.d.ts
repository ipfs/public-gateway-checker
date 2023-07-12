declare module '@dutu/rate-limiter'
declare module 'ipfs-geoip'

declare namespace IpfsGeoip {
  interface LookupResponse {
    country_code: string
    country_name: string
  }
}
