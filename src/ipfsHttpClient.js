import * as ipfsHttpClient from 'ipfs-http-client';
window.client = ipfsHttpClient.create({
    host: 'ipfs.io',
    port: 443,
    protocol: 'https'
});
export { ipfsHttpClient };
//# sourceMappingURL=ipfsHttpClient.js.map