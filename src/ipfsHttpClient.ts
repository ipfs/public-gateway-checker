import * as ipfsHttpClient from 'ipfs-http-client'
import { DEFAULT_IPFS_CLIENT_OPTIONS } from './constants'

// Creating a client for the IPFS HTTP API
window.client = ipfsHttpClient.create(DEFAULT_IPFS_CLIENT_OPTIONS)

export { ipfsHttpClient }
