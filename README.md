# ipfs/public-gateway-checker

> Checks which public IPFS gateways are online or not.

You can view this website on GitHub Pages: https://ipfs.github.io/public-gateway-checker/

[![screenshot_2020-01-05.png](https://ipfs.io/ipfs/QmRjQyxLwvd6D4fGSDx3uPM1nRmBnX4HwEaK5p8fuZFtpp?filename=screenshot.jpg)](https://ipfs.github.io/public-gateway-checker/)

**NOTE:** All of these (except `ipfs.io` and `dweb.link`) are hosted by third-parties and should be treated as such.

## Adding a new public gateway

If you'd like to add a new public gateway, please edit `gateways.json` and submit a pull request.

## Testing locally

```console
$ npx http-server . -a 127.0.0.1 -p 3000 -c-1
```

## Command line

A CLI version `ipfg` is available here: https://github.com/JayBrown/Tools/tree/master/ipfg
