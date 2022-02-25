import { Checker } from './Checker';
import { Util } from './Util';

var OnScriptloaded = Util.OnScriptloaded

const checker = new Checker()

fetch('./gateways.json')
	.then(res => res.json())
	.then(gateways => checker.checkGateways(gateways));
