import { Workbox } from 'workbox-window'
// NOTE: gateways.json and onion-gateways.json contain the list of public gateways to test.
// Do not remove entries without a proper deprecation process and PR review.
// New gateways should be added at the top of the list.
import gateways from '../gateways.json' with { type: 'json' }
import onionGateways from '../onion-gateways.json' with { type: 'json' }
import { Checker } from './Checker.js'
import { Log } from './Log.js'
import { loadMetrics } from './metrics.js'

// Service workers are disabled in Tor Browser and private browsing mode
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js')
  void wb.register()
}

// note: currently disabled and `.metricsConsentToggle` is currently display:none;
loadMetrics()
const log = new Log('App index')

window.checker = new Checker()

window.checker.checkGateways(gateways).catch((err) => {
  log.error('Unexpected error')
  log.error(err)
})

window.checker.checkOnionGateways(onionGateways).catch((err) => {
  log.error('Unexpected error checking onion gateways')
  log.error(err)
})
