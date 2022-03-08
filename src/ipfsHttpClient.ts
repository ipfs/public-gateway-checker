const ipfsHttpClient = window.IpfsHttpClient({
  host: 'ipfs.io',
  port: 443,
  protocol: 'https'
})
window.client = ipfsHttpClient

export { ipfsHttpClient }
