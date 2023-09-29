import { Workbox } from 'workbox-window';
import { Checker } from './Checker';
import { Log } from './Log';
import { loadCountly } from './metrics';
import report from './report.json';
const wb = new Workbox('/sw.js');
void wb.register();
loadCountly();
const log = new Log('App index');
window.checker = new Checker();
const gateways = Object.keys(report);
window.checker.checkGateways(gateways).catch((err) => {
    log.error('Unexpected error');
    log.error(err);
});
//# sourceMappingURL=index.js.map