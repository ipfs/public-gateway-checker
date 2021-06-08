# IPFS Public Gateway Checker

**A site displaying public IPFS gateways and their online/offline status.**

View the Public Gateway Checker on GitHub Pages: https://ipfs.github.io/public-gateway-checker/

[![Screenshot of Public Gateway Checker](https://user-images.githubusercontent.com/157609/121202304-7b485980-c875-11eb-913a-29b275afa0b3.png)](https://ipfs.github.io/public-gateway-checker/)


## SECURITY NOTES

- The list contains gateways operated by various parties, coordinated by loose mutual consensus, without a central governing authority. Protocol Labs operates and is responsible for only two of the listed gateways: `ipfs.io` and `dweb.link`.
- Gateways without origin isolation will be marked with ⚠️, indicating they are not safe for use cases that require private local storage of data or credentials. [Learn more](https://github.com/ipfs/public-gateway-checker/issues/150).
>>>>>>> 3cd5478 (docs: improved security notes)


## Adding a new public gateway


If you'd like to add a new public gateway, please edit `gateways.json`:
1. Add the gateway's address to the bottom of the list
2. Make sure the final item in the list does **not** have a comma at the end, but all preceding items do
3. If you care about security of websites loaded via your gateway, make sure it is set up as a [subdomain gateway](https://docs.ipfs.io/how-to/address-ipfs-on-web/#subdomain-gateway). See [config docs](https://github.com/ipfs/go-ipfs/blob/master/docs/config.md#gatewaypublicgateways) and  [recipes](https://github.com/ipfs/go-ipfs/blob/master/docs/config.md#gateway-recipes) for go-ipfs, and [learn more here](https://github.com/ipfs/public-gateway-checker/issues/150).

Then, submit a pull request for this change. Be sure to follow all the directions in the pull request template so your PR can be triaged as quickly as possible.



## Testing locally

```console
$ npx serve -l 3000
```

## Command line

Prefer to check public gateways from your terminal? A CLI version, `ipfg`, is available at https://github.com/JayBrown/Tools/tree/master/ipfg.
