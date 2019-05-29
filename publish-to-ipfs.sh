#! /usr/bin/env bash

#Setting pwd to our path
cd $(pwd)/$(dirname $0)

ipfs add -wrQ app.js index.html gateways/ > lastpubver
if [$1 = "-v"]; then
  cat lastpubver
fi
