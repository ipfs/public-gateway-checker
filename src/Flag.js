import { TokenBucketLimiter } from '@dutu/rate-limiter';
import { lookup as IpfsGeoIpLookup } from 'ipfs-geoip';
import { Log } from './Log';
import { UiComponent } from './UiComponent';
import { DEFAULT_IPFS_GATEWAY } from './constants';
const log = new Log('Flag');
class Flag extends UiComponent {
    constructor(parent, hostname) {
        super(parent, 'div', 'Flag');
        this.parent = parent;
        this.hostname = hostname;
    }
    async check() {
        let ask = true;
        try {
            const savedSTR = localStorage.getItem(this.hostname);
            if (savedSTR != null) {
                const saved = JSON.parse(savedSTR);
                const now = Date.now();
                const savedTime = saved.time;
                const elapsed = now - savedTime;
                const expiration = 7 * 24 * 60 * 60 * 1000; // 7 days
                if (elapsed < expiration) {
                    ask = false;
                    this.onResponse(saved);
                }
            }
        }
        catch (e) {
            log.error(`error while getting savedSTR for ${this.hostname}`, e);
            this.onError();
            throw e;
        }
        if (ask) {
            this.startLimiters();
            const url = await this.waitForAvailableEndpoint();
            await this.dnsRequest(url);
        }
    }
    startLimiters() {
        if (Flag.googleLimiter.isStopped === true) {
            Flag.googleLimiter.start();
        }
        if (Flag.cloudFlareLimiter.isStopped === true) {
            Flag.cloudFlareLimiter.start();
        }
    }
    async waitForAvailableEndpoint() {
        const url = await Promise.race([
            Flag.googleLimiter.awaitTokens(1).then(() => Flag.googleLimiter.tryRemoveTokens(1)).then((tokenAvailable) => {
                if (tokenAvailable) {
                    return `https://dns.google/resolve?name=${this.hostname}&type=A`;
                }
            }),
            Flag.cloudFlareLimiter.awaitTokens(1).then(() => Flag.cloudFlareLimiter.tryRemoveTokens(1)).then((tokenAvailable) => {
                if (tokenAvailable) {
                    return `https://cloudflare-dns.com/dns-query?name=${this.hostname}&type=A`;
                }
            })
        ]);
        if (url == null) {
            // No available tokens...
            log.info('we awaited tokens, but could not retrieve any.. restarting dnsRequest');
            return this.waitForAvailableEndpoint();
        }
        else {
            return url;
        }
    }
    async dnsRequest(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/dns-json'
                }
            });
            const responseJson = await response.json();
            await this.handleDnsQueryResponse(responseJson);
        }
        catch (err) {
            log.error('problem submitting DNS request', url, err);
            this.onError();
        }
    }
    async handleDnsQueryResponse(response) {
        if (response.Answer == null) {
            log.error('Response does not contain the "Answer" property:', response);
            this.onError();
            return;
        }
        let ip = null;
        for (let i = 0; i < response.Answer.length && ip == null; i++) {
            const answer = response.Answer[i];
            if (answer.type === 1) {
                ip = answer.data;
            }
        }
        if (ip != null) {
            try {
                const geoipResponse = await IpfsGeoIpLookup(DEFAULT_IPFS_GATEWAY, ip);
                if (geoipResponse?.country_code != null) {
                    this.onResponse(geoipResponse);
                    geoipResponse.time = Date.now();
                    const responseSTR = JSON.stringify(geoipResponse);
                    localStorage.setItem(this.hostname, responseSTR);
                }
                else {
                    log.error('geoipResponse.country_code is null');
                }
            }
            catch (e) {
                log.error(`error while getting DNS A record for ${this.hostname}`, e);
                this.onError();
            }
        }
        else {
            log.error('IP is still null', response);
        }
    }
    onError() {
        this.tag.empty();
    }
    onResponse(response) {
        this.tag.style.setProperty('background-image', `url('https://ipfs.io/ipfs/QmaYjj5BHGAWfopTdE8ESzypbuthsZqTeqz9rEuh3EJZi6/${response.country_code.toLowerCase()}.svg')`);
        this.tag.title = response.country_name;
        this.tag.empty(); // remove textContent icon since we're using a background image
    }
}
/**
 */
Flag.googleLimiter = new TokenBucketLimiter({ bucketSize: 1, tokensPerInterval: 1, interval: 1000 * 2, stopped: true });
Flag.cloudFlareLimiter = new TokenBucketLimiter({ bucketSize: 1, tokensPerInterval: 1, interval: 1000 * 2, stopped: true });
export { Flag };
//# sourceMappingURL=Flag.js.map