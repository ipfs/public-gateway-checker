import { Checker } from './Checker'
import { Util } from './Util'
import gateways from './gateways.json'

window.OnScriptloaded = Util.OnScriptloaded

const checker = new Checker()

window.checker = checker

checker.checkGateways(gateways)
