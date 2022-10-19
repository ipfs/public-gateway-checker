import { create } from 'ipfs-http-client'

const ipfsHttpClientSingleton = create({
  host: 'ipfs.io',
  port: 443,
  protocol: 'https'
})

export { ipfsHttpClientSingleton }
