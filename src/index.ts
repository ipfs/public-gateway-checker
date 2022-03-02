import { Checker } from './Checker'
import gateways from './gateways.json'
import { Log } from './Log'

const logger = new Log('Index')

// this function is executed from that previously loaded script
// it only contains the following: OnScriptloaded(document.currentScript ? document.currentScript.src : '');
window.OnScriptloaded = (src: ConstructorParameters<typeof URL>[0]) => {
  try {
    const url = new URL(src)
    const index = url.searchParams.get('i')
    if (index != null) {
      const node = window.checker.nodes[Number(index)]
      if (node != null) {
        node.checked()
      }
    }
  } catch (e) {
    // this is a URL exception, we can do nothing, user is probably using Internet Explorer
    logger.error(e)
  }
}

(window.checker = new Checker()).checkGateways(gateways)
