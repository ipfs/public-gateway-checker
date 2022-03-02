import { URL } from 'url-ponyfill'
import { Log } from './Log'

const logger = new Log('Util')
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Util {
  static HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m'
  static IMG_HASH = 'bafybeibwzifw52ttrkqlikfzext5akxu7lz4xiwjgwzmqcpdzmp3n5vnbe' // 1x1.png
  // static IFRAME_HASH = 'bafkreifx3g6bkkwl7b4v43lvcqfo5vshbiehuvmpky2zayhfpg5qj7y3ca'
  static HASH_STRING = 'Hello from IPFS Gateway Checker'

  static async checkViaImgSrc (imgUrl: string | URL) {
    // we check if gateway is up by loading 1x1 px image:
    // this is more robust check than loading js, as it won't be blocked
    // by privacy protections present in modern browsers or in extensions such as Privacy Badger
    const imgCheckTimeout = 15000
    return await new Promise<void>((resolve, reject) => {
      let timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
        if (timeout()) {
          reject(new Error('Timer was already cancelled'))
        }
      }, imgCheckTimeout)
      const timeout = () => {
        if (timer == null) {
          return false
        }
        clearTimeout(timer)
        timer = null
        return true
      }
      const img = new Image()
      img.onerror = () => {
        timeout()
        reject(new Error('image error'))
      }
      img.onload = () => {
        // subdomain works
        timeout()
        resolve()
      }
      img.src = imgUrl.toString()
    })
  }

  static gatewayHostname (url: URL) {
    let urlString: string = url.toString()

    if (url?.hostname != null) {
      urlString = url.hostname.toString()
    }

    return urlString.replace(`${Util.HASH_TO_TEST}.ipfs.`, '') // skip .ipfs. in subdomain gateways
      .replace(`${Util.HASH_TO_TEST}.`, '') // path-based
  }

  // function expectSubdomainRedirect(url) {
  //   // Detecting redirects on remote Origins is extra tricky,
  //   // but we seem to be able to access xhr.responseURL which is enough to see
  //   // if paths are redirected to subdomains.
  //   return new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest()
  //     xhr.open('GET', url, true)
  //     xhr.onload = function () {
  //       // expect to be redirected to subdomain where first DNS label is CID
  //       if (new URL(xhr.responseURL).hostname.startsWith(IMG_HASH)) {
  //         resolve()
  //       } else {
  //         reject()
  //       }
  //     }
  //     xhr.onerror = function (err) {
  //       console.error(url, err)
  //       reject()
  //     }
  //     xhr.send(null)
  //   })
  // }
  static async expectSubdomainRedirect (url: string | URL) {
    // Detecting redirects on remote Origins is extra tricky,
    // but we seem to be able to access xhr.responseURL which is enough to see
    // if paths are redirected to subdomains.
    return await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onload = function () {
        // expect to be redirected to subdomain where first DNS label is CID
        const { hostname } = new URL(xhr.responseURL)
        if (hostname.startsWith(Util.IMG_HASH)) {
          resolve()
        } else {
          reject(new Error('Expected to be redirected to subdomain where first DNS label is CID'))
        }
      }
      xhr.onerror = function (err) {
        logger.error(url, err)
        reject(err)
      }
      xhr.send(null)
    })
  }
}

export { Util }
