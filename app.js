/*
	This will check IPFS gateways status using 2 methods
		1) By asking for a script through a <script src=""> tag, which when loaded, it executes some code
		2) By asking data through ajax requests to verify gateway's CORS configuration
*/

// ////////////////////////////////////////////////////////////////////////////////////
// Constants
const HASH_TO_TEST = 'Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a';
const SCRIPT_HASH = 'QmYHbXzTCbjavphzqrTe7zYYMW8HyeuMLNcLbqiUkj9TAH';
const HASH_STRING = 'Hello from IPFS Gateway Checker';

// ////////////////////////////////////////////////////////////////////////////////////
// Checker
// checker is the program root, it contains all involved objects
// Read it as an object instance, as if you do let checker = new Checker();
let checker = document.getElementById('checker');
checker.nodes = []; // nodes contains all created nodes, based on gateways.json

// It updates screen stats
checker.updateStats = function(node) {
	// We check this, because a gateway can be checked against 2 methods
	// and we're done only with the first one
	if (!node.tested) {
		// following code prints some stats in screen
		let up = 0, down = 0;
		for (let savedNode of this.nodes) {
			if (savedNode.tested || (node == savedNode)) {
				savedNode.status.up ? ++up : ++down;
			}
		}
		let gtwschckd = `${up+down}/${this.nodes.length} gateways checked`;
		let totals = ` ==> ${up} ✅ - ${down} ❌`;
		// here is the printing line
		this.stats.textContent = gtwschckd + totals;
	}
};

// we define checker's stats attribute, which is directly a HTML element
checker.stats = document.getElementById('checker.stats');
// set its parent for bidirectional communication
checker.stats.parent = checker;

// ////////////////////////////////////////////////////////////////////////////////////
// Results
// it is defined checker's results attribute, which is directly a HTML element
checker.results = document.getElementById('checker.results');
// set its parent for bidirectional communication
checker.results.parent = checker;
// this method is called when a node is successfully checked through some of the available methods
checker.results.checked = function(node) {
	// we prepend its tag to bring it to the top (yep, i know it is a lazy sorting method)
	this.prepend(node.tag);
	// here we update the stats
	this.parent.updateStats(node);
};

// this is called when 
checker.results.failed = function(node) {
	// we prepend its tag to bring it to the bottom (yep, i know it is a lazy sorting method)
	this.append(node.tag);
	// here we update the stats
	this.parent.updateStats(node);
};
// Results
// ////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////
// Status
// It is like a class , we create status objects by doing let status = new Status();
// Status objects will check gatways using mthod number 1
let Status = function(parent, index) {
	// set its parent for bidirectional communication
	this.parent = parent;
	// create its tag to be appended to its parent
	this.tag = document.createElement("span");
	// set its initial text
	this.tag.textContent = ' WAIT: 🕑 - ';
	// set the initial status to down
	this.up = false;
};

// this is called by its parent when the program is ready to begin the checking process
Status.prototype.check = function() {
	// replace :hash with the SCRIPT_HASH
	// it will end up being something like this
	// https://permaweb.io/ipfs/QmYHbXzTCbjavphzqrTe7zYYMW8HyeuMLNcLbqiUkj9TAH
	let gatewayAndScriptHash = this.parent.gateway.replace(":hash", SCRIPT_HASH);
	// It is a meassure to prevent browsers from cache this content
	// is it right ? ... do you know a better way ?
	let rnd = encodeURIComponent(Math.random());
	// create a string to be used as src attribute with the script tag
	// 3 important things here
	//   1) we add #x-ipfs-companion-no-redirect to the final address (it is self explanatory)
	//   2) we add filename=anyname.js as a parameter to let the gateway guess a mime type
	//      to be sent in headers response, it is done to prevent CORB 
	//   3) parameter 'i' is the one used to identify the gateway once the script executes
	let src = `${gatewayAndScriptHash}?i=${this.parent.index}&rnd=${rnd}&filename=anyname.js#x-ipfs-companion-no-redirect`;
	// let's create the script tag
	let script = document.createElement('script');
	// set its recently created src attribute
	script.src = src;
	// and append it to the page's body, because, why not ?
	document.body.append(script);
	// set an error handler to be executed if something went wrong
	script.onerror = () => {
		// we check for this.up because it could be already checked by CORS before we reach here
		// and, even though it is failing here, we know it is UP
		if (!this.up) {
			this.tag.textContent = 'DOWN: ❌ - ';
			this.parent.failed();
		}
	};
};

// It is executed when the script is successfully executed
Status.prototype.checked = function() {
	// we know it is UP now
	this.up = true;
	this.tag.innerHTML = '&nbsp;&nbsp;UP: ✅ - ';
};

// this function is executed from the previously loaded script
// in fact, it contains only the following line:
// OnScriptloaded(document.currentScript ? document.currentScript.src : '');
function OnScriptloaded(src) {
	try {
		// create a url object
		let url = new URL(src);
		// try to get 'i' parameter
		let index = url.searchParams.get("i");
		// get the originating node
		let node = checker.nodes[index];
		// and if it exists
		if (node) {
			// it is up and running
			node.checked();
		}
	} catch(e) {
		// this is a URL exception, we can do nothing, the user is probably using Internet Explorer
	}
}
// ////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////
// CORS
// It is like a class , we create status objects by doing let cors = new Cors();
// Cors objects will check gatways using mthod number 2
let Cors = function(parent) {
	// set its parent for bidirectional communication
	this.parent = parent;
	// create its tag to be appended to its parent
	this.tag = document.createElement("span");
	// set its initial text
	this.tag.textContent = ' CORS: 🕑 - ';
};

// this is called by its parent when the program is ready to begin the checking process
Cors.prototype.check = function() {
	// replace :hash with the HASH_TO_TEST
	// it will end up being something like this
	// https://permaweb.io/ipfs/Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a
	const gatewayAndHash = this.parent.gateway.replace(':hash', HASH_TO_TEST);
	// same as before
	const rnd = encodeURIComponent(Math.random());
	// now we create the url to make the request to
	const testUrl = `${gatewayAndHash}?rnd=${rnd}#x-ipfs-companion-no-redirect`;
	// here we make it
	fetch(testUrl).then((res) => {
		return res.text();
	}).then((text) => {
		// if it went ok
		const matched = (HASH_STRING === text.trim());
		// check whether expected and returned values math
		if (matched) {
			// if they do, we know this gateway is up and running
			this.parent.checked();
			this.tag.textContent = ' CORS: ✅ - ';
		} else {
			// if they don't match, we consider it as an error
			// is it possible to wrongly reach here ????
			this.onerror();
		}
	}).catch((err) => {
		// incomment this line to print errors
		// console.error(err, err.stack);
		// and show the gateway down in screen
		this.onerror();
	});
};

// this is called when something in the request process went wrong
Cors.prototype.onerror = function() {
	this.tag.textContent = ' CORS: ❌ - ';
};
// ////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////
// NODE
// Node is root for every gateway in the list
let Node = function(parent, gateway, index) {
	// set its parent for bidirectional communication
	this.parent = parent;
	// create its tag to be appended to its parent
	this.tag = document.createElement("div");

	this.status = new Status(this);
	this.tag.append(this.status.tag);

	this.cors = new Cors(this);
	this.tag.append(this.cors.tag);

	// here we are going to put gateway's link
	this.link = document.createElement("span");
	this.link.textContent = gateway.replace(':hash', HASH_TO_TEST);
	this.tag.append(this.link);

	// here we are going to show how long it took to check a gateway
	this.took = document.createElement("span");
	this.tag.append(this.took);

	// save some data attributes
	this.gateway = gateway;
	this.index = index;
	this.checkingTime = 0; // it is used to make timing calculations
};

// this is called by its parent when the program is ready to begin the checking process
Node.prototype.check = function() {
	// save 'when' checking process started
	this.checkingTime = performance.now();
	// start both checking methods
	this.status.check();
	this.cors.check();
};

// this is called either by one of the 2 methods (or both) when they succeed
// it means, it could be called more than once (2 to be accurate :)
Node.prototype.checked = function() {
	// if it is the first time this function is executed (we care only about the fatest method)
	if (!this.status.up) {
		// let status know it is UP, it is done here, because we show it UP no matter what method succeeded
		this.status.checked();
		// let the parent know it, it will update stats
		this.parent.checked(this);

		// one arbitrary rule we use here is that if it is successfully checked, then
		// we show a link on screen
		let gatewayTitle = this.gateway.split(":hash")[0];
		let gatewayAndHash = this.gateway.replace(':hash', HASH_TO_TEST);
		this.link.innerHTML = `<a title="${gatewayTitle}"href="${gatewayAndHash}"target="_blank">${gatewayAndHash}</a>`;

		// show how long it took
		let ms = (performance.now() - this.checkingTime).toFixed(2);
		this.took.textContent = ` (${ms}ms)`;

		// and set it to true for future reference
		this.tested = true;
	}
};

// this is called when the script request fails (not the ajax one)
Node.prototype.failed = function() {
	// let its parent know about it
	this.parent.failed(this);
	// set it to true for future references, yep i know, it could be less ugly
	this.tested = true;
};
// ////////////////////////////////////////////////////////////////////////////////////

// this is executed when gateways list is correctly retreived
function checkGateways (gateways) {
	// loops over all gathered gateways
	gateways.forEach((gateway) => {
		// it creates a node for every gateway we have
		let node = new Node(checker.results, gateway, checker.nodes.length);
		// add it to nodes array for future reference
		checker.nodes.push(node);
		// append the HTML tag to its parent
		checker.results.append(node.tag);
		// start checking process for this gateway
		node.check();
	});
}

// fetch gateways list
fetch('./gateways.json')
	.then(res => res.json())
	.then(gateways => checkGateways(gateways));

