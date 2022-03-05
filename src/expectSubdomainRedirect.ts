import { URL } from 'url-ponyfill'

import { Log } from './Log'
import { Util } from './Util'

const log = new Log('expectSubdomainRedirect')

// async function expectSubdomainRedirect (url: string | URL) {
//   // Detecting redirects on remote Origins is extra tricky,
//   // but we seem to be able to access xhr.responseURL which is enough to see
//   // if paths are redirected to subdomains.
//   return await new Promise<void>((resolve, reject) => {
//     const xhr = new XMLHttpRequest()
//     xhr.open('GET', url, true)
//     xhr.onload = function () {
//       // expect to be redirected to subdomain where first DNS label is CID
//       const { hostname } = new URL(xhr.responseURL)
//       if (hostname.startsWith(Util.IMG_HASH)) {
//         resolve()
//       } else {
//         reject(new Error('Expected to be redirected to subdomain where first DNS label is CID'))
//       }
//     }
//     xhr.onerror = function (err) {
//       log.error(url, err)
//       reject(err)
//     }
//     xhr.send(null)
//   })
// }
async function expectSubdomainRedirect (url: string | URL) {
  // Detecting redirects on remote Origins is extra tricky,
  // but we seem to be able to access xhr.responseURL which is enough to see
  // if paths are redirected to subdomains.

  const { redirected, url: responseUrl } = await fetch(url.toString())
  log.debug('redirected: ', redirected)
  log.debug('responseUrl: ', responseUrl)

  if (redirected) {
    log.debug('definitely redirected')
  }
  const { hostname } = new URL(responseUrl)

  if (!hostname.startsWith(Util.IMG_HASH)) {
    const msg = `Expected ${url.toString()} to redirect to subdomain '${Util.IMG_HASH}' but instead received '${responseUrl}'`
    log.debug(msg)
    throw new Error(msg)
  }

  // return await new Promise<void>((resolve, reject) => {
  //   const xhr = new XMLHttpRequest()
  //   xhr.open('GET', url, true)
  //   xhr.onload = function () {
  //     // expect to be redirected to subdomain where first DNS label is CID
  //     const { hostname } = new URL(xhr.responseURL)
  //     if (hostname.startsWith(Util.IMG_HASH)) {
  //       resolve()
  //     } else {
  //       reject(new Error('Expected to be redirected to subdomain where first DNS label is CID'))
  //     }
  //   }
  //   xhr.onerror = function (err) {
  //     log.error(url, err)
  //     reject(err)
  //   }
  //   xhr.send(null)
  // })
}

export { expectSubdomainRedirect }
