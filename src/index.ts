import { Checker } from './Checker'
import gateways from './gateways.json'
import { onScriptLoaded } from './onScriptLoaded'

import { Log } from './Log'

const log = new Log('App index')
// this function is executed from that previously loaded script
// it only contains the following: OnScriptloaded(document.currentScript ? document.currentScript.src : '');
window.OnScriptloaded = onScriptLoaded

window.checker = new Checker()

window.checker.checkGateways(gateways).catch((err) => {
  log.error('Unexpected error')
  log.error(err)
})
