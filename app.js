const HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m';
const SCRIPT_HASH = 'bafybeietzsezxbgeeyrmwicylb5tpvf7yutrm3bxrfaoulaituhbi7q6yi';
const HASH_STRING = 'Hello from IPFS Gateway Checker';

// checker is the program root, it contains all involved objects
let checker = document.getElementById('checker');
checker.nodes = []; // nodes contains all created nodes, based on gateways.json

checker.updateStats = function(node) {
	if (!node.tested) {
		let up = 0, down = 0;
		for (let savedNode of this.nodes) {
			if (savedNode.tested || (node == savedNode)) {
				savedNode.status.up ? ++up : ++down;
			}
		}
		let gtwschckd = `${up + down}/${this.nodes.length} gateways checked`;
		let totals = ` ==> ${up} ✅ - ${down} ❌`;
		this.stats.textContent = gtwschckd + totals;
	}
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

// ////////////////////////////////////////////////////////////////////////////////////
// STATUS
let Status = function(parent, index) {
	this.parent = parent;
	this.tag = document.createElement("span");
	this.tag.textContent = ' WAIT: 🕑 - ';
	this.up = false;
};

Status.prototype.check = function() {
	const gatewayAndScriptHash = this.parent.gateway.replace(":hash", SCRIPT_HASH);
	const rnd = encodeURIComponent(Math.random());
	const src = `${gatewayAndScriptHash}?i=${this.parent.index}&rnd=${rnd}#x-ipfs-companion-no-redirect`;
	let script = document.createElement('script')
	script.src = src;
	document.body.append(script);
	script.onerror = () => {
		if (!this.up) { // it could be already checked by CORS before we reach here
			this.tag.textContent = 'DOWN: ❌ - ';
			this.parent.failed();
		}
	};
};

Status.prototype.checked = function() {
	this.up = true;
	this.tag.innerHTML = '&nbsp;&nbsp;UP: ✅ - ';
};

function OnScriptloaded(src) {
	try {
		let url = new URL(src);
		let index = url.searchParams.get("i");
		let node = checker.nodes[index];
		if (node) {
			node.checked();
		}
	} catch(e) {
		// this is a URL exception, we can do nothing, the user is probably using Internet Explorer
	}
}
// ////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////
// CORS
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
		console.error(err, err.stack);
		this.onerror();
	});
};

Cors.prototype.onerror = function() {
	this.tag.textContent = ' CORS: ❌ - ';
};
// ////////////////////////////////////////////////////////////////////////////////////

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
	this.status.checked();
	this.parent.checked(this);

	let gatewayTitle = this.gateway.split(":hash")[0];
	let gatewayAndHash = this.gateway.replace(':hash', HASH_TO_TEST);
	this.link.innerHTML = `<a title="${gatewayTitle}" href="${gatewayAndHash}#x-ipfs-companion-no-redirect" target="_blank">${gatewayAndHash}</a>`;

	if (!this.tested) {
		let ms = (performance.now() - this.checkingTime).toFixed(2);
		this.took.textContent = ` (${ms}ms)`;
	}

	this.tested = true;
};

Node.prototype.failed = function() {
	this.parent.failed(this);
	this.tested = true;
};
// ////////////////////////////////////////////////////////////////////////////////////


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
