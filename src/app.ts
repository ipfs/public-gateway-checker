import { Checker } from './Checker'
import { Util } from './Util'

window.OnScriptloaded = Util.OnScriptloaded

window.checker = new Checker()

fetch('./gateways.json')
  .then(async res => await res.json())
  .then((gateways: string[]) => window.checker.checkGateways(gateways))
