import { HASH_TO_TEST } from './constants'

function gatewayHostname (url: URL): string {
  let urlString: string = url.toString()

  if (url?.hostname != null) {
    urlString = url.hostname.toString()
  }

  return urlString.replace(`${HASH_TO_TEST}.ipfs.`, '') // skip .ipfs. in subdomain gateways
    .replace(`${HASH_TO_TEST}.`, '') // path-based
}

export { gatewayHostname }
