import fetchPonyfill from 'fetch-ponyfill'

import { Checker } from './Checker'
import { Util } from './Util'

const { fetch } = fetchPonyfill()

window.OnScriptloaded = Util.OnScriptloaded

const checker = new Checker()

window.checker = checker

void (async () => {
  const gatewaysJson = await fetch('./gateways.json')
  const gateways: string[] = await gatewaysJson.json()
  checker.checkGateways(gateways)

  // .then(async res => await res.json())
  // .then((gateways: string[]) => window.checker.checkGateways(gateways))
})()
