#!/bin/bash

# IPFS public gateway checker v1.0 (shell script version)
# original repository: https://github.com/ipfs/public-gateway-checker
# this script added by Joss Brown: https://github.com/JayBrown

JSON_URL="https://raw.githubusercontent.com/ipfs/public-gateway-checker/master/gateways.json"
TESTHASH="Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a"

echo "Public IPFS Gateways"

GATEWAYS=$(curl --silent "$JSON_URL" | sed -e '$ d' -e '1,1d' -e 's/\"//g')
if [[ $GATEWAYS == "" ]] ; then
	echo "Error: no gateways found."
	exit
fi

GWNUM=$(echo "$GATEWAYS" | wc -l | xargs)

while read -r GATEWAY
do

	GATEWAY=$(echo "$GATEWAY" | xargs)
	TESTURL=$(echo "$GATEWAY" | sed -e "s-:hash,-$TESTHASH-" -e "s-:hash-$TESTHASH-")
	DOMAIN=$(echo "$GATEWAY" | awk -F/ '{print $1"//"$3}')

	if [[ $(curl --silent "$TESTURL") == "Hello from IPFS Gateway Checker" ]] ; then
		echo -e "✅  Online:\t$DOMAIN"
	else
		echo -e "❌  Offline:\t$DOMAIN"
	fi

done < <(echo "$GATEWAYS")

echo "Done: $GWNUM gateways checked."
exit
