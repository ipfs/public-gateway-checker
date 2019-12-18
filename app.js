/*
	This program will check IPFS gateways status using 2 methods
		1) By asking for a script through a <script src=""> tag, which when loaded, it executes some code
		2) By asking data through ajax requests to verify gateway's CORS configuration
*/

const HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m';
const SCRIPT_HASH = 'bafybeietzsezxbgeeyrmwicylb5tpvf7yutrm3bxrfaoulaituhbi7q6yi';
const HASH_STRING = 'Hello from IPFS Gateway Checker';

let checker = document.getElementById('checker');
checker.nodes = [];

checker.updateStats = function(node) {
	let up = 0, down = 0;
	for (let savedNode of this.nodes) {
		if ("up" in savedNode.status) {
			savedNode.status.up ? ++up : ++down;
		}
	}
	let gtwschckd = `${up+down}/${this.nodes.length} gateways checked`;
	let totals = ` ==> ${up} ✅ - ${down} ❌`;
	this.stats.textContent = gtwschckd + totals;
};

checker.stats = document.getElementById('checker.stats');
checker.stats.parent = checker;

checker.results = document.getElementById('checker.results');
checker.results.parent = checker;
checker.results.checked = function(node) {
	this.prepend(node.tag);
	this.parent.updateStats(node);
};

checker.results.failed = function(node) {
	this.append(node.tag);
	this.parent.updateStats(node);
};

let Status = function(parent, index) {
	this.parent = parent;
	this.tag = document.createElement("span");
	this.tag.textContent = ' WAIT: 🕑 - ';
};

Status.prototype.check = function() {
	let gatewayAndScriptHash = this.parent.gateway.replace(":hash", SCRIPT_HASH);

	// we set a random number as a url parameter, to try to prevent content caching
	// is it right ? ... do you know a better way ? ... does it always work ?
	let rnd = new Date().getTime();

	// 3 important things here
	//   1) we add #x-ipfs-companion-no-redirect to the final url (self explanatory)
	//   2) we add ?filename=anyname.js as a parameter to let the gateway set correct Content-Type header
	//      to be sent in headers in order to prevent CORB
	//   3) parameter 'i' is the one used to identify the gateway once the script executes
	let src = `${gatewayAndScriptHash}?i=${this.parent.index}&rnd=${rnd}&filename=anyname.js#x-ipfs-companion-no-redirect`;
	
	let script = document.createElement('script');
	script.src = src;
	document.body.append(script);
	script.onerror = () => {
		// we check this because the gateway could be already checked by CORS before onerror executes
		// and, even though it is failing here, we know it is UP
		if (!this.up) {
			this.up = false;
			this.tag.textContent = 'DOWN: ❌ - ';
			this.parent.failed();
		}
	};
};

Status.prototype.checked = function() {
	this.up = true;
	this.tag.innerHTML = '&nbsp;&nbsp;UP: ✅ - ';
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
	this.tag = document.createElement("span");
	this.tag.textContent = ' CORS: 🕑 - ';
};

Cors.prototype.check = function() {
	const gatewayAndHash = this.parent.gateway.replace(':hash', HASH_TO_TEST);
	const rnd = encodeURIComponent(Math.random());
	const testUrl = `${gatewayAndHash}?rnd=${rnd}#x-ipfs-companion-no-redirect`;
	fetch(testUrl).then((res) => {
		return res.text();
	}).then((text) => {
		const matched = (HASH_STRING === text.trim());
		if (matched) {
			this.parent.checked();
			this.tag.textContent = ' CORS: ✅ - ';
		} else {
			this.onerror();
		}
	}).catch((err) => {
		this.onerror();
	});
};

Cors.prototype.onerror = function() {
	this.tag.textContent = ' CORS: ❌ - ';
};

// ////////////////////////////////////////////////////////////////////////////////////
// ORIGIN
let Origin = function(parent) {
	this.parent = parent;

	this.tag = document.createElement("span");
	this.tag.textContent = ' ORIGIN: 🕑 - ';
};

Origin.prototype.check = function() {
	const cidInSubdomain = this.parent.gateway.startsWith('https://:hash.ipfs.');
	if (cidInSubdomain) {
		this.tag.textContent = ' ORIGIN: ✅ - ';
	} else {
		this.onerror();
	}
};

Origin.prototype.onerror = function() {
	this.tag.textContent = ' ORIGIN: ❌ - ';
};
// ////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////
// NODE
let Node = function(parent, gateway, index) {
	this.parent = parent;
	this.tag = document.createElement("div");

	this.status = new Status(this);
	this.tag.append(this.status.tag);

	this.cors = new Cors(this);
	this.tag.append(this.cors.tag);

	this.origin = new Origin(this);
	this.tag.append(this.origin.tag);

	this.link = document.createElement("span");
	this.link.textContent = gateway.replace(':hash', HASH_TO_TEST);
	this.tag.append(this.link);

	this.took = document.createElement("span");
	this.tag.append(this.took);

	this.gateway = gateway;
	this.index = index;
	this.checkingTime = 0;
};

Node.prototype.check = function() {
	this.checkingTime = performance.now();
	this.status.check();
	this.cors.check();
	this.origin.check();
};

Node.prototype.checked = function() {
	// we care only about the fatest method
	if (!this.status.up) {
		this.status.checked();
		this.parent.checked(this);
    let gatewayTitle = this.gateway.split(":hash")[0];
    let gatewayAndHash = this.gateway.replace(':hash', HASH_TO_TEST);
    this.link.innerHTML = `<a title="${gatewayTitle}" href="${gatewayAndHash}#x-ipfs-companion-no-redirect" target="_blank">${gatewayAndHash}</a>`;
		let ms = (performance.now() - this.checkingTime).toFixed(2);
		this.took.textContent = ` (${ms}ms)`;
	}
};

Node.prototype.failed = function() {
	this.parent.failed(this);
};

function checkGateways (gateways) {
	gateways.forEach((gateway) => {
		let node = new Node(checker.results, gateway, checker.nodes.length);
		checker.nodes.push(node);
		checker.results.append(node.tag);
		node.check();
	});
}

fetch('./gateways.json')
	.then(res => res.json())
	.then(gateways => checkGateways(gateways));
