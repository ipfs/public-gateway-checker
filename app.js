/*
	This program will check IPFS gateways status using 3 methods
		1) By asking for a script through a <script src=""> tag, which when loaded, it executes some code
		2) By asking data through fetch requests to verify gateway's CORS configuration
		3) By asking data through img requests to verify subdomain configuration
*/

const HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m';
const IMG_HASH = 'bafybeibwzifw52ttrkqlikfzext5akxu7lz4xiwjgwzmqcpdzmp3n5vnbe'; // 1x1.png
// const IFRAME_HASH = 'bafkreifx3g6bkkwl7b4v43lvcqfo5vshbiehuvmpky2zayhfpg5qj7y3ca'
const HASH_STRING = 'Hello from IPFS Gateway Checker';

const ipfs_http_client = window.IpfsHttpClient({
  host: 'ipfs.io',
  port: 443,
  protocol: 'https'
});


let checker = document.getElementById('checker');
checker.nodes = [];

checker.checkGateways = function(gateways) {
  for (const gateway of gateways) {
    const node = new Node(this.results, gateway, this.nodes.length)
    this.nodes.push(node)
    this.results.append(node.tag)
    setTimeout(() => node.check(), 100 * this.nodes.length);
  }
}

checker.updateStats = function() {
	this.stats.update();
};

let Stats = function(parent) {
	this.parent = parent;
	this.tag = document.getElementById('checker.stats');//document.createElement("div"); // TODO:: ugly i know, WIP
	this.tag.className = "Stats";

	this.gateways = document.createElement("div");
	this.gateways.textContent = `0/0 tested`;
	this.gateways.className = "Gateways";
	this.tag.append(this.gateways);

	this.totals = document.createElement("div");
	this.totals.textContent = "0 online";
	this.totals.className = "Totals";
	this.tag.append(this.totals);
};

Stats.prototype.update = function() {
	let up = 0, down = 0;
	for (let savedNode of this.parent.nodes) {
		if ("up" in savedNode.status) {
			savedNode.status.up ? ++up : ++down;
		}
	}
	this.gateways.textContent = `${up+down}/${this.parent.nodes.length} tested`;
	this.totals.textContent = `${up} online`;
};


checker.stats = new Stats(checker);

checker.results = document.getElementById('checker.results');
checker.results.parent = checker;
checker.results.checked = function(node) {
	this.parent.updateStats(node);
};

checker.results.failed = function(node) {
	this.parent.updateStats(node);
};

let Status = function(parent, index) {
	this.parent = parent;
	this.tag = document.createElement("div");
	this.tag.className = "Status";
	this.tag.textContent = '🕑';
};

function checkViaImgSrc (imgUrl) {
  // we check if gateway is up by loading 1x1 px image:
  // this is more robust check than loading js, as it won't be blocked
  // by privacy protections present in modern browsers or in extensions such as Privacy Badger
  const imgCheckTimeout = 15000
  return new Promise((resolve, reject) => {
    const timeout = () => {
      if (!timer) return false
      clearTimeout(timer)
      timer = null
      return true
    }
    let timer = setTimeout(() => { if (timeout()) reject() }, imgCheckTimeout)
    const img = new Image()
    img.onerror = () => {
      timeout()
      reject()
    }
    img.onload = () => {
      // subdomain works
      timeout()
      resolve()
    }
    img.src = imgUrl
  })
}

// This tries to load iframe and talk to it over postMessage
// (tests CORS isolation)
/* TODO: decide if this is useful
function checkViaIframe (gateway) {
  const gwUrl = new URL(gateway)
  // now - ensures we don't read from browser cache
  // filename - ensures correct content-type is returned / sniffed
  // x-ipfs-companion-no-redirect - hint for our browser extension, makes sure we test remote server
  const now = Date.now()
  const iframePathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IFRAME_HASH}?now=${now}&filename=origin-check.html#x-ipfs-companion-no-redirect`)
  const iframeSubdomainUrl = new URL(`${gwUrl.protocol}//${IFRAME_HASH}.ipfs.${gwUrl.hostname}/?now=${now}&filename=origin-check.html#x-ipfs-companion-no-redirect`)
  const iframeCheckTimeout = 15000
  return new Promise((resolve, reject) => {
    const timeout = () => {
      if (!timer) return false
      clearTimeout(timer)
      timer = null
      return true
    }
    let timer = setTimeout(() => { if (timeout()) reject() }, iframeCheckTimeout)
    const iframe = document.createElement("iframe")
    iframe.src = iframePathUrl.toString()
    iframe.name = `iframe-${gwUrl.hostname}`
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onerror = () => {
      timeout()
      reject()
    }
    iframe.onload = () => {
      window.addEventListener("message", (event) => {
        if (event.origin === iframeSubdomainUrl.origin) {
          console.log('checkViaIframe.event', event)
          timeout()
          resolve()
        }
      }, false)
      iframe.contentWindow.postMessage("hello there! is your origin correct?", iframeSubdomainUrl.origin)
    }
  })
}
*/

Status.prototype.check = function() {
// test by loading subresource via img.src (path will work on both old and subdomain gws)
const gwUrl = new URL(this.parent.gateway)
const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
checkViaImgSrc(imgPathUrl).then(() => {
    this.tag.textContent = '🌍';
    this.parent.checked()
  }).catch(() => {
		// we check this because the gateway could be already checked by CORS before onerror executes
		// and, even though it is failing here, we know it is UP
		if (!this.up) {
			this.up = false;
			this.tag.textContent = '❌';
			this.parent.failed();
		}
  })
};

Status.prototype.checked = function() {
	this.up = true;
	this.tag.innerHTML = '🌍';
  this.parent.tag.classList.add('online')
};

// this function is executed from that previously loaded script
// it only contains the following: OnScriptloaded(document.currentScript ? document.currentScript.src : '');
function OnScriptloaded(src) {
	try {
		let url = new URL(src);
		let index = url.searchParams.get("i");
		let node = checker.nodes[index];
		if (node) {
			node.checked();
		}
	} catch(e) {
		// this is a URL exception, we can do nothing, user is probably using Internet Explorer
	}
}

let Cors = function(parent) {
	this.parent = parent;
	this.tag = document.createElement("div");
	this.tag.className = "Cors";
	this.tag.textContent = '🕑';
};

Cors.prototype.check = function() {
  const now = Date.now()
  const gatewayAndHash = this.parent.gateway.replace(':hash', HASH_TO_TEST)
  const testUrl = `${gatewayAndHash}?now=${now}#x-ipfs-companion-no-redirect`
  // response body can be accessed only if fetch was executed when
  // liberal CORS is present (eg. '*')
  fetch(testUrl).then((res) => res.text()).then((text) => {
    const matched = (HASH_STRING === text.trim())
    if (matched) {
      this.parent.checked()
      this.tag.textContent = '*'
      this.parent.tag.classList.add('cors')
    } else {
      this.onerror()
    }
  }).catch((err) => this.onerror())
}

Cors.prototype.onerror = function() {
	this.tag.textContent = '';
};

let Origin = function(parent) {
	this.parent = parent;
	this.tag = document.createElement("div");
	this.tag.className = "Origin";
	this.tag.textContent = '🕑';
};

function expectSubdomainRedirect(url) {
  // Detecting redirects on remote Origins is extra tricky,
  // but we seem to be able to access xhr.responseURL which is enough to see
  // if paths are redirected to subdomains.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
      // expect to be redirected to subdomain where first DNS label is CID
      if (new URL(xhr.responseURL).hostname.startsWith(IMG_HASH)) {
        resolve()
      } else {
        reject()
      }
    }
    xhr.onerror = function (err) {
      console.error(url, err)
      reject()
    }
    xhr.send(null)
  })
}

Origin.prototype.check = function() {
// we are unable to check url after subdomain redirect because some gateways
// may not have proper CORS in place. instead, we manually construct subdomain
// URL and check if it loading known image works
const gwUrl = new URL(this.parent.gateway)
// const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${now}&filename=1x1.png#x-ipfs-companion-no-redirect`)
const imgSubdomainUrl = new URL(`${gwUrl.protocol}//${IMG_HASH}.ipfs.${gwUrl.hostname}/?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
const imgRedirectedPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
checkViaImgSrc(imgSubdomainUrl)
  .then(() => expectSubdomainRedirect(imgRedirectedPathUrl)
  .then(() => {
    this.tag.textContent = '✅';
    this.parent.tag.classList.add('origin')
    this.parent.checked()
  }))
  .catch(() => this.onerror())
}

Origin.prototype.onerror = function() {
	this.tag.textContent = '⚠️';
};


let Flag = function(parent, hostname) {
	this.parent = parent;
	this.tag = document.createElement("div");
	this.tag.className = "Flag";
	this.tag.textContent = '';

	let ask = true;

	try{
		let savedSTR = localStorage.getItem(hostname);
		if (savedSTR) {
			let saved = JSON.parse(savedSTR);
			let now = Date.now();
			let savedTime = saved.time;
			let elapsed = now - savedTime;
			let expiration = 7 * 24 * 60 * 60 * 1000; // 7 days
			if (elapsed < expiration) {
				ask = false;
				this.onResponse(saved);
			}
		}
	} catch(e) {
    console.error(`error while getting savedSTR for ${hostname}`, e)
	}

	if (ask) {
		setTimeout(() => {
			let request = new XMLHttpRequest();
			request.open('GET', `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`);
			request.setRequestHeader("accept", "application/dns-json");
			request.onreadystatechange = async () => {
				if (4 == request.readyState) {
					if (200 == request.status) {
						try {
							let response = JSON.parse(request.responseText);
							let ip = null;
							for (let i = 0; i < response.Answer.length && !ip; i++) {
								let answer = response.Answer[i];
								if (1 == answer.type) {
									ip = answer.data;
								}
							}
							if (ip) {
								let geoipResponse = await window.IpfsGeoip.lookup(ipfs_http_client, ip);
								if (geoipResponse && geoipResponse.country_code) {
									this.onResponse(geoipResponse);
									geoipResponse.time = Date.now();
									let resposeSTR = JSON.stringify(geoipResponse);
									localStorage.setItem(hostname, resposeSTR);
								}
							}
						} catch(e) {
              console.error(`error while getting DNS A record for ${hostname}`, e)
						}
					}
				}
			};
			request.onerror = (e) => {};
			request.send();
		}, 500 * Flag.requests++); // 2 / second, request limit
	}
};

Flag.prototype.onResponse = function(response) {
	this.tag.style["background-image"] = `url('https://ipfs.io/ipfs/QmaYjj5BHGAWfopTdE8ESzypbuthsZqTeqz9rEuh3EJZi6/${response.country_code.toLowerCase()}.svg')`;
	this.tag.title = response.country_name;
};

Flag.requests = 0;

let Node = function(parent, gateway, index) {
	this.parent = parent;
	this.tag = document.createElement("div");
	this.tag.className = "Node";
	this.tag.style["order"] = Date.now();

	this.status = new Status(this);
	this.tag.append(this.status.tag);

	this.cors = new Cors(this);
	this.tag.append(this.cors.tag);

	this.origin = new Origin(this);
	this.tag.append(this.origin.tag);


	this.link = document.createElement("div");
	let gatewayAndHash = gateway.replace(':hash', HASH_TO_TEST);
	this.link.url = new URL(gatewayAndHash);
	this.link.textContent = gatewayHostname(this.link.url);
	this.link.className = "Link";

	this.flag = new Flag(this, this.link.textContent);
	this.tag.append(this.flag.tag);
	this.tag.append(this.link);

	this.took = document.createElement("div");
	this.took.className = "Took";
	this.tag.append(this.took);

	this.gateway = gateway;
	this.index = index;
	this.checkingTime = 0;
};

Node.prototype.check = function() {
	this.checkingTime = Date.now();
	this.status.check();
	this.cors.check();
	this.origin.check();
};

Node.prototype.checked = function() {
	// we care only about the fatest method
	if (!this.status.up) {
		this.status.checked();
		this.parent.checked(this);
		let url = this.link.url;
		let host = gatewayHostname(url);
		this.link.innerHTML = `<a title="${host}" href="${url}#x-ipfs-companion-no-redirect" target="_blank">${host}</a>`;
		let ms = Date.now() - this.checkingTime;
		this.tag.style["order"] = ms;
		let s = (ms / 1000).toFixed(2);
		this.took.textContent = `${s}s`;
	}
};

Node.prototype.failed = function() {
	this.parent.failed(this);
};

function gatewayHostname (url) {
	if (url && url.hostname) url = url.hostname.toString()
	return url.replace(`${HASH_TO_TEST}.ipfs.`, "") // skip .ipfs. in subdomain gateways
		.replace(`${HASH_TO_TEST}.`, "") // path-based
}

fetch('./gateways.json')
	.then(res => res.json())
	.then(gateways => checker.checkGateways(gateways));
