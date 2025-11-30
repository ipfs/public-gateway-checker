# IPFS Public Gateway Checker

**A site displaying public IPFS gateways and their online/offline status.**

View the Public Gateway Checker in action

* on GitHub Pages: https://ipfs.github.io/public-gateway-checker/

[![Screenshot of Public Gateway Checker](https://user-images.githubusercontent.com/157609/121263486-f7fb2800-c8b5-11eb-9061-0b6f586a6f25.png)](https://ipfs.github.io/public-gateway-checker/)

## SECURITY NOTES

- For complex websites and apps, only use gateways with ✅ in the Origin column. Gateways marked ⚠️ lack origin isolation: all sites share localStorage, cookies, and session data. [Learn more](https://github.com/ipfs/public-gateway-checker/issues/150).
- For wallets and dapps, self-host your gateway on your local machine using [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/) or [Kubo](https://docs.ipfs.tech/install/command-line/).
- No central authority governs this list. IPFS Foundation operates only: `ipfs.io`, `dweb.link`, and `trustless-gateway.link`.

## Adding a new public gateway

### Regular gateways

Edit `./gateways.json`:

1. Add the gateway's address to the **top** of the list
2. If you care about security of websites loaded via your gateway, make sure it is set up as a [subdomain gateway](https://docs.ipfs.tech/how-to/address-ipfs-on-web/#subdomain-gateway). See [config docs](https://github.com/ipfs/kubo/blob/master/docs/config.md#gatewaypublicgateways) and [recipes](https://github.com/ipfs/kubo/blob/master/docs/config.md#gateway-recipes) for Kubo, and [learn more here](https://github.com/ipfs/public-gateway-checker/issues/150).

### Tor onion gateways

Edit `./onion-gateways.json`:

1. Add the `.onion` gateway address to the list
2. Note: these gateways are only testable via [Tor Browser](https://www.torproject.org/download/)

Then, submit a pull request for this change. Be sure to follow all the directions in the pull request template so your PR can be triaged as quickly as possible.

## Testing locally

```bash
npm ci
npm run build
npm start
```

Then open http://localhost:3000/

**Testing in Tor Browser:** To access `localhost:3000`, go to `about:config` and set:
- `network.proxy.allow_hijacking_localhost` = `true`
- `network.proxy.no_proxies_on` = `localhost, 127.0.0.1`

Remember to reset these settings after testing.
