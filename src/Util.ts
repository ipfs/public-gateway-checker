class Util {
  // const HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m';
  // const IMG_HASH = 'bafybeibwzifw52ttrkqlikfzext5akxu7lz4xiwjgwzmqcpdzmp3n5vnbe'; // 1x1.png
  // // const IFRAME_HASH = 'bafkreifx3g6bkkwl7b4v43lvcqfo5vshbiehuvmpky2zayhfpg5qj7y3ca'
  // const HASH_STRING = 'Hello from IPFS Gateway Checker';
  static HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m'
  static IMG_HASH = 'bafybeibwzifw52ttrkqlikfzext5akxu7lz4xiwjgwzmqcpdzmp3n5vnbe' // 1x1.png
  // static IFRAME_HASH = 'bafkreifx3g6bkkwl7b4v43lvcqfo5vshbiehuvmpky2zayhfpg5qj7y3ca'
  static HASH_STRING = 'Hello from IPFS Gateway Checker'

  // const ipfs_http_client = window.IpfsHttpClient({
  //   host: 'ipfs.io',
  //   port: 443,
  //   protocol: 'https'
  // });
  static ipfs_http_client = window.IpfsHttpClient({
    host: 'ipfs.io',
    port: 443,
    protocol: 'https'
  })

  static async checkViaImgSrc(imgUrl: string | URL) {
    // we check if gateway is up by loading 1x1 px image:
    // this is more robust check than loading js, as it won't be blocked
    // by privacy protections present in modern browsers or in extensions such as Privacy Badger
    const imgCheckTimeout = 15000
    return await new Promise<void>((resolve, reject) => {
      let timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
        if (timeout()) {
          reject()
        }
      }, imgCheckTimeout)
      const timeout = () => {
        if (!timer) {
          return false
        }
        clearTimeout(timer)
        timer = null
        return true
      }
      const img = new Image()
      img.onerror = () => {
        timeout()
        reject()
      }
      img.onload = () => {
        // subdomain works
        timeout()
        resolve()
      }
      img.src = imgUrl.toString()
    })
  }

  // function gatewayHostname (url) {
  // 	if (url && url.hostname) url = url.hostname.toString()
  // 	return url.replace(`${HASH_TO_TEST}.ipfs.`, "") // skip .ipfs. in subdomain gateways
  // 		.replace(`${HASH_TO_TEST}.`, "") // path-based
  // }
  static gatewayHostname(url: URL) {
    let urlString: string = url.toString()

    if (url && url.hostname) {
      urlString = url.hostname.toString()
    }

    return urlString.replace(`${Util.HASH_TO_TEST}.ipfs.`, '') // skip .ipfs. in subdomain gateways
      .replace(`${Util.HASH_TO_TEST}.`, '') // path-based
  }

  // function OnScriptloaded(src) {
  // 	try {
  // 		let url = new URL(src);
  // 		let index = url.searchParams.get("i");
  // 		let node = checker.nodes[index];
  // 		if (node) {
  // 			node.checked();
  // 		}
  // 	} catch(e) {
  // 		// this is a URL exception, we can do nothing, user is probably using Internet Explorer
  // 	}
  // }

  // this function is executed from that previously loaded script
  // it only contains the following: OnScriptloaded(document.currentScript ? document.currentScript.src : '');
  static OnScriptloaded(src: ConstructorParameters<typeof URL>[0]) {
    try {
      const url = new URL(src)
      const index = url.searchParams.get('i')
      if (index != null) {
        const node = window.checker.nodes[Number(index)]
        if (node) {
          node.checked()
        }
      }
    } catch (e) {
      // this is a URL exception, we can do nothing, user is probably using Internet Explorer
      console.error(e)
    }
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
  static async expectSubdomainRedirect(url: string | URL) {
    // Detecting redirects on remote Origins is extra tricky,
    // but we seem to be able to access xhr.responseURL which is enough to see
    // if paths are redirected to subdomains.
    return await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onload = function () {
        // expect to be redirected to subdomain where first DNS label is CID
        if (new URL(xhr.responseURL).hostname.startsWith(Util.IMG_HASH)) {
          resolve()
        } else {
          reject()
        }
      }
      xhr.onerror = function (err) {
        console.error(url, err)
        reject()
      }
      xhr.send(null)
    })
  }
}

export { Util }
