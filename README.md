# IPFS Public Gateway Checker

**A site displaying public IPFS gateways and their online/offline status.**

View the Public Gateway Checker on GitHub Pages: https://ipfs.github.io/public-gateway-checker/

[![Screenshot of Public Gateway Checker](https://gateway.ipfs.io/ipfs/QmZBvMaV3EBtuUB4yGD5gGJwmEyePpk2sWjvPEoLJKcH5D)](https://ipfs.github.io/public-gateway-checker/)

**NOTE:** With the exception of `ipfs.io` and `dweb.link`, all gateways listed are hosted by third parties and should be treated as such.

## Adding a new public gateway

If you'd like to add a new public gateway, please edit `gateways.json`:
1. Add the gateway's address to the bottom of the list
2. Make sure the final item in the list does **not** have a comma at the end, but all preceding items do

Then, submit a pull request for this change. Be sure to follow all the directions in the pull request template so your PR can be triaged as quickly as possible.

## Testing locally

```console
$ npx serve -l 3000
```

## Command line

Prefer to check public gateways from your terminal? A CLI version, `ipfg`, is available at https://github.com/JayBrown/Tools/tree/master/ipfg.
