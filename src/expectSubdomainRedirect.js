import { URL } from 'url-ponyfill';
import { Log } from './Log';
import { IMG_HASH } from './constants';
const log = new Log('expectSubdomainRedirect');
async function expectSubdomainRedirect(url) {
    // Detecting redirects on remote Origins is extra tricky,
    // but we seem to be able to access xhr.responseURL which is enough to see
    // if paths are redirected to subdomains.
    const { redirected, url: responseUrl } = await fetch(url.toString());
    log.debug('redirected: ', redirected);
    log.debug('responseUrl: ', responseUrl);
    if (redirected) {
        log.debug('definitely redirected');
    }
    const { hostname } = new URL(responseUrl);
    if (!hostname.startsWith(IMG_HASH)) {
        const msg = `Expected ${url.toString()} to redirect to subdomain '${IMG_HASH}' but instead received '${responseUrl}'`;
        log.debug(msg);
        throw new Error(msg);
    }
}
export { expectSubdomainRedirect };
//# sourceMappingURL=expectSubdomainRedirect.js.map