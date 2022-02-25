import { Status } from './Status';
import { Tag } from './Tag';

// let Node = function(parent, gateway, index) {
// 	this.parent = parent;
// 	this.tag = document.createElement("div");
// 	this.tag.className = "Node";
// 	this.tag.style["order"] = Date.now();

// 	this.status = new Status(this);
// 	this.tag.append(this.status.tag);

// 	this.cors = new Cors(this);
// 	this.tag.append(this.cors.tag);

// 	this.origin = new Origin(this);
// 	this.tag.append(this.origin.tag);


// 	this.link = document.createElement("div");
// 	let gatewayAndHash = gateway.replace(':hash', HASH_TO_TEST);
// 	this.link.url = new URL(gatewayAndHash);
// 	this.link.textContent = gatewayHostname(this.link.url);
// 	this.link.className = "Link";

// 	this.flag = new Flag(this, this.link.textContent);
// 	this.tag.append(this.flag.tag);
// 	this.tag.append(this.link);

// 	this.took = document.createElement("div");
// 	this.took.className = "Took";
// 	this.tag.append(this.took);

// 	this.gateway = gateway;
// 	this.index = index;
// 	this.checkingTime = 0;
// };
class GatewayNode {
    tag: Tag;
    status: Status;
    cors: Cors;
    origin: Origin;
    link: HTMLDivElement;
    flag: Flag;
    took: HTMLDivElement;
    gateway: unknown;
    index: unknown;
    checkingTime: number;

    constructor(private readonly parent: unknown, gateway: unknown, index: unknown) {
        // this.parent = parent;
        this.tag = new Tag('div', 'Node')
        // this.tag.className = "Node";
        this.tag.style["order"] = Date.now().toString();

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

    // Node.prototype.check = function() {
    //     this.checkingTime = Date.now();
    //     this.status.check();
    //     this.cors.check();
    //     this.origin.check();
    // };
    private check () {
        this.checkingTime = Date.now();
        this.status.check();
        this.cors.check();
        this.origin.check();
    };

    // Node.prototype.checked = function() {
    //     // we care only about the fatest method
    //     if (!this.status.up) {
    //         this.status.checked();
    //         this.parent.checked(this);
    //         let url = this.link.url;
    //         let host = gatewayHostname(url);
    //         this.link.innerHTML = `<a title="${host}" href="${url}#x-ipfs-companion-no-redirect" target="_blank">${host}</a>`;
    //         let ms = Date.now() - this.checkingTime;
    //         this.tag.style["order"] = ms;
    //         let s = (ms / 1000).toFixed(2);
    //         this.took.textContent = `${s}s`;
    //     }
    // };
    private checked () {
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

    // Node.prototype.failed = function() {
    // 	this.parent.failed(this);
    // };
    private failed () {
    	this.parent.failed(this);
    };
}

export {GatewayNode};
