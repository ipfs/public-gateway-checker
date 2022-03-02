
const ipfsHttpClient = window.IpfsHttpClient.create({
  host: 'ipfs.io',
  port: 443,
  protocol: 'https'
})

export { ipfsHttpClient }
