import { Checker } from './Checker'
import gateways from './gateways.json'

import { Log } from './Log'

const log = new Log('App index')

window.client = window.IpfsHttpClient.create({
  host: 'ipfs.io',
  port: 443,
  protocol: 'https'
})

window.checker = new Checker()

window.checker.checkGateways(gateways).catch((err) => {
  log.error('Unexpected error')
  log.error(err)
})
