var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define("src/Util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Util = void 0;
    var Util = /** @class */ (function () {
        function Util() {
        }
        Util.checkViaImgSrc = function (imgUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var imgCheckTimeout;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            imgCheckTimeout = 15000;
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    var timer = setTimeout(function () {
                                        if (timeout()) {
                                            reject();
                                        }
                                    }, imgCheckTimeout);
                                    var timeout = function () {
                                        if (!timer) {
                                            return false;
                                        }
                                        clearTimeout(timer);
                                        timer = null;
                                        return true;
                                    };
                                    var img = new Image();
                                    img.onerror = function () {
                                        timeout();
                                        reject();
                                    };
                                    img.onload = function () {
                                        // subdomain works
                                        timeout();
                                        resolve();
                                    };
                                    img.src = imgUrl.toString();
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // function gatewayHostname (url) {
        // 	if (url && url.hostname) url = url.hostname.toString()
        // 	return url.replace(`${HASH_TO_TEST}.ipfs.`, "") // skip .ipfs. in subdomain gateways
        // 		.replace(`${HASH_TO_TEST}.`, "") // path-based
        // }
        Util.gatewayHostname = function (url) {
            var urlString = url.toString();
            if (url && url.hostname) {
                urlString = url.hostname.toString();
            }
            return urlString.replace("".concat(Util.HASH_TO_TEST, ".ipfs."), '') // skip .ipfs. in subdomain gateways
                .replace("".concat(Util.HASH_TO_TEST, "."), ''); // path-based
        };
        // function OnScriptloaded(src) {
        // 	try {
        // 		let url = new URL(src);
        // 		let index = url.searchParams.get("i");
        // 		let node = checker.nodes[index];
        // 		if (node) {
        // 			node.checked();
        // 		}
        // 	} catch(e) {
        // 		// this is a URL exception, we can do nothing, user is probably using Internet Explorer
        // 	}
        // }
        // this function is executed from that previously loaded script
        // it only contains the following: OnScriptloaded(document.currentScript ? document.currentScript.src : '');
        Util.OnScriptloaded = function (src) {
            try {
                var url = new URL(src);
                var index = url.searchParams.get('i');
                if (index != null) {
                    var node = window.checker.nodes[Number(index)];
                    if (node) {
                        node.checked();
                    }
                }
            }
            catch (e) {
                // this is a URL exception, we can do nothing, user is probably using Internet Explorer
                console.error(e);
            }
        };
        // function expectSubdomainRedirect(url) {
        //   // Detecting redirects on remote Origins is extra tricky,
        //   // but we seem to be able to access xhr.responseURL which is enough to see
        //   // if paths are redirected to subdomains.
        //   return new Promise((resolve, reject) => {
        //     const xhr = new XMLHttpRequest()
        //     xhr.open('GET', url, true)
        //     xhr.onload = function () {
        //       // expect to be redirected to subdomain where first DNS label is CID
        //       if (new URL(xhr.responseURL).hostname.startsWith(IMG_HASH)) {
        //         resolve()
        //       } else {
        //         reject()
        //       }
        //     }
        //     xhr.onerror = function (err) {
        //       console.error(url, err)
        //       reject()
        //     }
        //     xhr.send(null)
        //   })
        // }
        Util.expectSubdomainRedirect = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var xhr = new XMLHttpRequest();
                                xhr.open('GET', url, true);
                                xhr.onload = function () {
                                    // expect to be redirected to subdomain where first DNS label is CID
                                    if (new URL(xhr.responseURL).hostname.startsWith(Util.IMG_HASH)) {
                                        resolve();
                                    }
                                    else {
                                        reject();
                                    }
                                };
                                xhr.onerror = function (err) {
                                    console.error(url, err);
                                    reject();
                                };
                                xhr.send(null);
                            })];
                        case 1: 
                        // Detecting redirects on remote Origins is extra tricky,
                        // but we seem to be able to access xhr.responseURL which is enough to see
                        // if paths are redirected to subdomains.
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // const HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m';
        // const IMG_HASH = 'bafybeibwzifw52ttrkqlikfzext5akxu7lz4xiwjgwzmqcpdzmp3n5vnbe'; // 1x1.png
        // // const IFRAME_HASH = 'bafkreifx3g6bkkwl7b4v43lvcqfo5vshbiehuvmpky2zayhfpg5qj7y3ca'
        // const HASH_STRING = 'Hello from IPFS Gateway Checker';
        Util.HASH_TO_TEST = 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m';
        Util.IMG_HASH = 'bafybeibwzifw52ttrkqlikfzext5akxu7lz4xiwjgwzmqcpdzmp3n5vnbe'; // 1x1.png
        // static IFRAME_HASH = 'bafkreifx3g6bkkwl7b4v43lvcqfo5vshbiehuvmpky2zayhfpg5qj7y3ca'
        Util.HASH_STRING = 'Hello from IPFS Gateway Checker';
        // const ipfs_http_client = window.IpfsHttpClient({
        //   host: 'ipfs.io',
        //   port: 443,
        //   protocol: 'https'
        // });
        Util.ipfs_http_client = window.IpfsHttpClient({
            host: 'ipfs.io',
            port: 443,
            protocol: 'https'
        });
        return Util;
    }());
    exports.Util = Util;
});
// let Cors = function(parent) {
// 	this.parent = parent;
// 	this.tag = document.createElement("div");
// 	this.tag.className = "Cors";
// 	this.tag.textContent = '🕑';
define("src/Cors", ["require", "exports", "src/CheckBase", "src/Util"], function (require, exports, CheckBase_1, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cors = void 0;
    // };
    var Cors = /** @class */ (function (_super) {
        __extends(Cors, _super);
        function Cors(parent) {
            var _this = _super.call(this, parent, 'div', 'Cors') || this;
            _this.parent = parent;
            _this._className = 'Cors';
            _this._tagName = 'div';
            return _this;
            // this.tag = new Tag('div', 'Cors')
            // 	this.parent = parent;
            // 	this.tag = document.createElement("div");
            // 	this.tag.className = "Cors";
            // 	this.tag.textContent = '🕑';
        }
        // Cors.prototype.check = function() {
        //   const now = Date.now()
        //   const gatewayAndHash = this.parent.gateway.replace(':hash', HASH_TO_TEST)
        //   const testUrl = `${gatewayAndHash}?now=${now}#x-ipfs-companion-no-redirect`
        //   // response body can be accessed only if fetch was executed when
        //   // liberal CORS is present (eg. '*')
        //   fetch(testUrl).then((res) => res.text()).then((text) => {
        //     const matched = (HASH_STRING === text.trim())
        //     if (matched) {
        //       this.parent.checked()
        //       this.tag.textContent = '*'
        //       this.parent.tag.classList.add('cors')
        //     } else {
        //       this.onerror()
        //     }
        //   }).catch((err) => this.onerror())
        // }
        Cors.prototype.check = function () {
            var _this = this;
            var now = Date.now();
            var gatewayAndHash = this.parent.gateway.replace(':hash', Util_1.Util.HASH_TO_TEST);
            var testUrl = "".concat(gatewayAndHash, "?now=").concat(now, "#x-ipfs-companion-no-redirect");
            // response body can be accessed only if fetch was executed when
            // liberal CORS is present (eg. '*')
            fetch(testUrl).then(function (res) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.text()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }).then(function (text) {
                var matched = (Util_1.Util.HASH_STRING === text.trim());
                if (matched) {
                    _this.parent.checked();
                    // this.tag.textContent = '*'
                    _this.tag.asterisk();
                    _this.parent.tag.classList.add('cors');
                }
                else {
                    _this.onerror();
                }
            }).catch(function (err) { return _this.onerror(); });
        };
        Cors.prototype.checked = function () {
            console.warn('Not implemented yet');
        };
        // Cors.prototype.onerror = function() {
        //     this.tag.textContent = '';
        // };
        Cors.prototype.onerror = function () {
            // this.tag.textContent = ''
            this.tag.err();
        };
        return Cors;
    }(CheckBase_1.CheckBase));
    exports.Cors = Cors;
});
define("src/TagStatus", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagStatus = void 0;
    var TagStatus;
    (function (TagStatus) {
        TagStatus["pending"] = "\uD83D\uDD51";
        TagStatus["successful"] = "\u2705";
        TagStatus["caution"] = "\u26A0\uFE0F";
        TagStatus["failed"] = "\u274C";
        TagStatus["global"] = "\uD83C\uDF0D";
        TagStatus["asterisk"] = "*";
    })(TagStatus || (TagStatus = {}));
    exports.TagStatus = TagStatus;
});
define("src/Tag", ["require", "exports", "src/TagStatus"], function (require, exports, TagStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tag = void 0;
    var Tag = /** @class */ (function () {
        function Tag(tagName, className, textContent) {
            if (tagName === void 0) { tagName = 'div'; }
            if (className === void 0) { className = undefined; }
            if (textContent === void 0) { textContent = TagStatus_1.TagStatus.pending; }
            var element = document.createElement(tagName);
            this.element = element;
            if (className != null) {
                this.className = className;
            }
            this.textContent = textContent;
        }
        Tag.fromElement = function (element) {
            var tag = new Tag('div');
            tag.element = element;
            return tag;
        };
        /**
         * Use the below functions to keep displays consistent
         */
        Tag.prototype.asterisk = function () { };
        Tag.prototype.lose = function () {
            this.textContent = TagStatus_1.TagStatus.failed;
        };
        Tag.prototype.win = function () {
            this.textContent = TagStatus_1.TagStatus.successful;
        };
        Tag.prototype.global = function () {
            this.textContent = TagStatus_1.TagStatus.global;
        };
        Tag.prototype.err = function () {
            this.textContent = TagStatus_1.TagStatus.caution;
        };
        Object.defineProperty(Tag.prototype, "style", {
            get: function () {
                return this.element.style;
            },
            enumerable: false,
            configurable: true
        });
        Tag.prototype.append = function (child) {
            if (child instanceof Tag) {
                child = child.element;
            }
            return this.element.append(child);
        };
        Object.defineProperty(Tag.prototype, "classList", {
            get: function () {
                return this.element.classList;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Tag.prototype, "title", {
            set: function (newTitle) {
                this.element.title = newTitle;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Tag.prototype, "className", {
            set: function (className) {
                this.element.className = className;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Tag.prototype, "textContent", {
            set: function (content) {
                this.element.textContent = content;
            },
            enumerable: false,
            configurable: true
        });
        return Tag;
    }());
    exports.Tag = Tag;
});
define("src/Results", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Results = void 0;
    var Results = /** @class */ (function () {
        function Results(parent) {
            this.parent = parent;
            this.element = document.getElementById('checker.results');
        }
        Results.prototype.append = function (tag) {
            throw new Error('Method not implemented.');
        };
        Results.prototype.checked = function () {
            this.parent.updateStats();
        };
        Results.prototype.failed = function () {
            this.parent.updateStats();
        };
        return Results;
    }());
    exports.Results = Results;
});
define("src/UiComponent", ["require", "exports", "src/Tag"], function (require, exports, Tag_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UiComponent = void 0;
    var UiComponent = /** @class */ (function () {
        function UiComponent(parent) {
            var tagParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                tagParams[_i - 1] = arguments[_i];
            }
            this.parent = parent;
            this.tag = new (Tag_1.Tag.bind.apply(Tag_1.Tag, __spreadArray([void 0], tagParams, false)))();
        }
        return UiComponent;
    }());
    exports.UiComponent = UiComponent;
});
define("src/Flag", ["require", "exports", "src/UiComponent", "src/Util"], function (require, exports, UiComponent_1, Util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Flag = void 0;
    // let Flag = function(parent, hostname) {
    // 	this.parent = parent;
    // 	this.tag = document.createElement("div");
    // 	this.tag.className = "Flag";
    // 	this.tag.textContent = '';
    // 	let ask = true;
    // 	try{
    // 		let savedSTR = localStorage.getItem(hostname);
    // 		if (savedSTR) {
    // 			let saved = JSON.parse(savedSTR);
    // 			let now = Date.now();
    // 			let savedTime = saved.time;
    // 			let elapsed = now - savedTime;
    // 			let expiration = 7 * 24 * 60 * 60 * 1000; // 7 days
    // 			if (elapsed < expiration) {
    // 				ask = false;
    // 				this.onResponse(saved);
    // 			}
    // 		}
    // 	} catch(e) {
    //     console.error(`error while getting savedSTR for ${hostname}`, e)
    // 	}
    // 	if (ask) {
    // 		setTimeout(() => {
    // 			let request = new XMLHttpRequest();
    // 			request.open('GET', `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`);
    // 			request.setRequestHeader("accept", "application/dns-json");
    // 			request.onreadystatechange = async () => {
    // 				if (4 == request.readyState) {
    // 					if (200 == request.status) {
    // 						try {
    // 							let response = JSON.parse(request.responseText);
    // 							let ip = null;
    // 							for (let i = 0; i < response.Answer.length && !ip; i++) {
    // 								let answer = response.Answer[i];
    // 								if (1 == answer.type) {
    // 									ip = answer.data;
    // 								}
    // 							}
    // 							if (ip) {
    // 								let geoipResponse = await window.IpfsGeoip.lookup(ipfs_http_client, ip);
    // 								if (geoipResponse && geoipResponse.country_code) {
    // 									this.onResponse(geoipResponse);
    // 									geoipResponse.time = Date.now();
    // 									let resposeSTR = JSON.stringify(geoipResponse);
    // 									localStorage.setItem(hostname, resposeSTR);
    // 								}
    // 							}
    // 						} catch(e) {
    //               console.error(`error while getting DNS A record for ${hostname}`, e)
    // 						}
    // 					}
    // 				}
    // 			};
    // 			request.onerror = (e) => {};
    // 			request.send();
    // 		}, 500 * Flag.requests++); // 2 / second, request limit
    // 	}
    // };
    var Flag = /** @class */ (function (_super) {
        __extends(Flag, _super);
        function Flag(parent, hostname) {
            var _this = _super.call(this, parent, 'div', 'Flag') || this;
            _this.parent = parent;
            _this.hostname = hostname;
            _this.setup();
            return _this;
        }
        Flag.prototype.setup = function () {
            var _this = this;
            var ask = true;
            try {
                var savedSTR = localStorage.getItem(this.hostname);
                if (savedSTR) {
                    var saved = JSON.parse(savedSTR);
                    var now = Date.now();
                    var savedTime = saved.time;
                    var elapsed = now - savedTime;
                    var expiration = 7 * 24 * 60 * 60 * 1000; // 7 days
                    if (elapsed < expiration) {
                        ask = false;
                        this.onResponse(saved);
                    }
                }
            }
            catch (e) {
                console.error("error while getting savedSTR for ".concat(this.hostname), e);
            }
            if (ask) {
                setTimeout(function () {
                    var request = new XMLHttpRequest();
                    request.open('GET', "https://cloudflare-dns.com/dns-query?name=".concat(_this.hostname, "&type=A"));
                    request.setRequestHeader('accept', 'application/dns-json');
                    request.onreadystatechange = function () { return __awaiter(_this, void 0, void 0, function () {
                        var response, ip, i, answer, geoipResponse, resposeSTR, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(request.readyState == 4)) return [3 /*break*/, 5];
                                    if (!(request.status == 200)) return [3 /*break*/, 5];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    response = JSON.parse(request.responseText);
                                    ip = null;
                                    for (i = 0; i < response.Answer.length && !ip; i++) {
                                        answer = response.Answer[i];
                                        if (answer.type == 1) {
                                            ip = answer.data;
                                        }
                                    }
                                    if (!ip) return [3 /*break*/, 3];
                                    return [4 /*yield*/, window.IpfsGeoip.lookup(Util_2.Util.ipfs_http_client, ip)];
                                case 2:
                                    geoipResponse = _a.sent();
                                    if (geoipResponse && geoipResponse.country_code) {
                                        this.onResponse(geoipResponse);
                                        geoipResponse.time = Date.now();
                                        resposeSTR = JSON.stringify(geoipResponse);
                                        localStorage.setItem(this.hostname, resposeSTR);
                                    }
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 5];
                                case 4:
                                    e_1 = _a.sent();
                                    console.error("error while getting DNS A record for ".concat(this.hostname), e_1);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    request.onerror = function (e) { };
                    request.send();
                }, 500 * Flag.requests++); // 2 / second, request limit
            }
        };
        // Flag.prototype.onResponse = function(response) {
        // 	this.tag.style["background-image"] = `url('https://ipfs.io/ipfs/QmaYjj5BHGAWfopTdE8ESzypbuthsZqTeqz9rEuh3EJZi6/${response.country_code.toLowerCase()}.svg')`;
        // 	this.tag.title = response.country_name;
        // };
        Flag.prototype.onResponse = function (response) {
            this.tag.style['background-image'] = "url('https://ipfs.io/ipfs/QmaYjj5BHGAWfopTdE8ESzypbuthsZqTeqz9rEuh3EJZi6/".concat(response.country_code.toLowerCase(), ".svg')");
            this.tag.title = response.country_name;
        };
        // Flag.requests = 0;
        Flag.requests = 0;
        return Flag;
    }(UiComponent_1.UiComponent));
    exports.Flag = Flag;
});
// let Origin = function(parent) {
// 	this.parent = parent;
// 	this.tag = document.createElement("div");
// 	this.tag.className = "Origin";
// 	this.tag.textContent = '🕑';
define("src/Origin", ["require", "exports", "src/Tag", "src/Util"], function (require, exports, Tag_2, Util_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Origin = void 0;
    // };
    var Origin = /** @class */ (function () {
        function Origin(parent) {
            this.parent = parent;
            this.tag = new Tag_2.Tag('div', 'Origin');
        }
        // Origin.prototype.check = function() {
        // // we are unable to check url after subdomain redirect because some gateways
        // // may not have proper CORS in place. instead, we manually construct subdomain
        // // URL and check if it loading known image works
        // const gwUrl = new URL(this.parent.gateway)
        // // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${now}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        // const imgSubdomainUrl = new URL(`${gwUrl.protocol}//${IMG_HASH}.ipfs.${gwUrl.hostname}/?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        // const imgRedirectedPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        // checkViaImgSrc(imgSubdomainUrl)
        //   .then(() => expectSubdomainRedirect(imgRedirectedPathUrl)
        //   .then(() => {
        //     this.tag.textContent = '✅';
        //     this.parent.tag.classList.add('origin')
        //     this.parent.checked()
        //   }))
        //   .catch(() => this.onerror())
        // }
        Origin.prototype.check = function () {
            var _this = this;
            // we are unable to check url after subdomain redirect because some gateways
            // may not have proper CORS in place. instead, we manually construct subdomain
            // URL and check if it loading known image works
            var gwUrl = new URL(this.parent.gateway);
            // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${now}&filename=1x1.png#x-ipfs-companion-no-redirect`)
            var imgSubdomainUrl = new URL("".concat(gwUrl.protocol, "//").concat(Util_3.Util.IMG_HASH, ".ipfs.").concat(gwUrl.hostname, "/?now=").concat(Date.now(), "&filename=1x1.png#x-ipfs-companion-no-redirect"));
            var imgRedirectedPathUrl = new URL("".concat(gwUrl.protocol, "//").concat(gwUrl.hostname, "/ipfs/").concat(Util_3.Util.IMG_HASH, "?now=").concat(Date.now(), "&filename=1x1.png#x-ipfs-companion-no-redirect"));
            Util_3.Util.checkViaImgSrc(imgSubdomainUrl)
                .then(function () { return Util_3.Util.expectSubdomainRedirect(imgRedirectedPathUrl)
                .then(function () {
                _this.tag.win();
                _this.parent.tag.classList.add('origin');
                _this.parent.checked();
            }); })
                .catch(function () { return _this.onerror(); });
        };
        Origin.prototype.onerror = function () {
            this.tag.err();
        };
        return Origin;
    }());
    exports.Origin = Origin;
});
// let Status = function(parent, index) {
// 	this.parent = parent;
// 	this.tag = document.createElement("div");
// 	this.tag.className = "Status";
// 	this.tag.textContent = '🕑';
define("src/Status", ["require", "exports", "src/UiComponent", "src/Util"], function (require, exports, UiComponent_2, Util_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Status = void 0;
    // };
    var Status = /** @class */ (function (_super) {
        __extends(Status, _super);
        function Status(parent) {
            var _this = _super.call(this, parent, 'div', 'Status') || this;
            _this.parent = parent;
            _this.up = false;
            return _this;
            // this.parent = parent;
            // this.tag = new Tag('div', 'Status')
        }
        // Status.prototype.check = function() {
        // // test by loading subresource via img.src (path will work on both old and subdomain gws)
        // const gwUrl = new URL(this.parent.gateway)
        // const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
        // checkViaImgSrc(imgPathUrl).then(() => {
        //     this.tag.textContent = '🌍';
        //     this.parent.checked()
        //   }).catch(() => {
        // 		// we check this because the gateway could be already checked by CORS before onerror executes
        // 		// and, even though it is failing here, we know it is UP
        // 		if (!this.up) {
        // 			this.up = false;
        // 			this.tag.textContent = '❌';
        // 			this.parent.failed();
        // 		}
        //   })
        // };
        Status.prototype.check = function () {
            var _this = this;
            // test by loading subresource via img.src (path will work on both old and subdomain gws)
            var gwUrl = new URL(this.parent.gateway);
            var imgPathUrl = new URL("".concat(gwUrl.protocol, "//").concat(gwUrl.hostname, "/ipfs/").concat(Util_4.Util.IMG_HASH, "?now=").concat(Date.now(), "&filename=1x1.png#x-ipfs-companion-no-redirect"));
            Util_4.Util.checkViaImgSrc(imgPathUrl).then(function () {
                // this.tag.textContent = '❌'
                _this.tag.lose();
                _this.parent.checked();
            }).catch(function () {
                // we check this because the gateway could be already checked by CORS before onerror executes
                // and, even though it is failing here, we know it is UP
                if (!_this.up) {
                    _this.up = false;
                    // this.tag.textContent = '❌'
                    _this.tag.lose();
                    _this.parent.failed();
                }
            });
        };
        // Status.prototype.checked = function() {
        // 	this.up = true;
        // 	this.tag.innerHTML = '🌍';
        //   this.parent.tag.classList.add('online')
        // };
        Status.prototype.checked = function () {
            this.up = true;
            // this.tag.innerHTML = '🌍'
            this.tag.global();
            this.parent.tag.classList.add('online');
        };
        Status.prototype.onerror = function () {
            throw new Error('Not implemented');
        };
        return Status;
    }(UiComponent_2.UiComponent));
    exports.Status = Status;
});
define("src/GatewayNode", ["require", "exports", "src/Cors", "src/Flag", "src/Origin", "src/Status", "src/UiComponent", "src/Util"], function (require, exports, Cors_1, Flag_1, Origin_1, Status_1, UiComponent_3, Util_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GatewayNode = void 0;
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
    var GatewayNode = /** @class */ (function (_super) {
        __extends(GatewayNode, _super);
        function GatewayNode(parent, gateway, index) {
            var _this = _super.call(this, parent, 'div', 'Node') || this;
            _this.parent = parent;
            // this.parent = parent;
            // this.tag = new Tag('div', 'Node')
            // this.tag.className = "Node";
            _this.tag.style.order = Date.now().toString();
            _this.status = new Status_1.Status(_this);
            _this.tag.append(_this.status.tag);
            _this.cors = new Cors_1.Cors(_this);
            _this.tag.append(_this.cors.tag);
            _this.origin = new Origin_1.Origin(_this);
            _this.tag.append(_this.origin.tag);
            _this.link = document.createElement('div');
            var gatewayAndHash = gateway.replace(':hash', Util_5.Util.HASH_TO_TEST);
            _this.link.url = new URL(gatewayAndHash);
            _this.link.textContent = Util_5.Util.gatewayHostname(_this.link.url);
            _this.link.className = 'Link';
            _this.flag = new Flag_1.Flag(_this, _this.link.textContent);
            _this.tag.append(_this.flag.tag);
            _this.tag.append(_this.link);
            _this.took = document.createElement('div');
            _this.took.className = 'Took';
            _this.tag.append(_this.took);
            _this.gateway = gateway;
            _this.index = index;
            _this.checkingTime = 0;
            return _this;
        }
        // Node.prototype.check = function() {
        //     this.checkingTime = Date.now();
        //     this.status.check();
        //     this.cors.check();
        //     this.origin.check();
        // };
        GatewayNode.prototype.check = function () {
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
        GatewayNode.prototype.checked = function () {
            // we care only about the fatest method
            if (!this.status.up) {
                this.status.checked();
                this.parent.checked();
                var url = this.link.url;
                if (url != null) {
                    var host = Util_5.Util.gatewayHostname(url);
                    this.link.innerHTML = "<a title=\"".concat(host, "\" href=\"").concat(url, "#x-ipfs-companion-no-redirect\" target=\"_blank\">").concat(host, "</a>");
                }
                var ms = Date.now() - this.checkingTime;
                this.tag.style.order = ms.toString();
                var s = (ms / 1000).toFixed(2);
                this.took.textContent = "".concat(s, "s");
            }
        };
        // Node.prototype.failed = function() {
        // 	this.parent.failed(this);
        // };
        GatewayNode.prototype.failed = function () {
            this.parent.failed();
        };
        GatewayNode.prototype.onerror = function () {
            this.tag.err();
        };
        return GatewayNode;
    }(UiComponent_3.UiComponent));
    exports.GatewayNode = GatewayNode;
});
define("src/Stats", ["require", "exports", "src/Tag", "src/UiComponent"], function (require, exports, Tag_3, UiComponent_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Stats = void 0;
    var Stats = /** @class */ (function (_super) {
        __extends(Stats, _super);
        function Stats(parent) {
            var _this = _super.call(this, parent) || this;
            _this.parent = parent;
            // this.parent = parent;
            // this.tag = document.getElementById('checker.stats')// document.createElement("div"); // TODO:: ugly i know, WIP
            // this.tag.className = 'Stats'
            var statsElement = document.getElementById('checker.stats');
            _this.tag = Tag_3.Tag.fromElement(statsElement);
            _this.gateways = document.createElement('div');
            _this.gateways.textContent = '0/0 tested';
            _this.gateways.className = 'Gateways';
            _this.tag.append(_this.gateways);
            _this.totals = document.createElement('div');
            _this.totals.textContent = '0 online';
            _this.totals.className = 'Totals';
            _this.tag.append(_this.totals);
            return _this;
        }
        Stats.prototype.update = function () {
            var up = 0;
            var down = 0;
            for (var _i = 0, _a = this.parent.nodes; _i < _a.length; _i++) {
                var savedNode = _a[_i];
                if ('up' in savedNode.status) {
                    savedNode.status.up ? ++up : ++down;
                }
            }
            this.gateways.textContent = "".concat(up + down, "/").concat(this.parent.nodes.length, " tested");
            this.totals.textContent = "".concat(up, " online");
        };
        return Stats;
    }(UiComponent_4.UiComponent));
    exports.Stats = Stats;
});
// let checker = document.getElementById('checker');
define("src/Checker", ["require", "exports", "src/GatewayNode", "src/Results", "src/Stats"], function (require, exports, GatewayNode_1, Results_1, Stats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checker = void 0;
    // checker.nodes = [];
    var Checker = /** @class */ (function () {
        // gateway: string | URL
        // private results: HTMLElement;
        function Checker() {
            this.nodes = [];
            this.element = document.getElementById('checker');
            this.stats = new Stats_1.Stats(this);
            this.results = new Results_1.Results(this);
            // this.results = document.getElementById('checker.results');
            // this.results.parent = this
        }
        // checker.updateStats = function() {
        // 	this.stats.update();
        // };
        Checker.prototype.updateStats = function () {
            this.stats.update();
        };
        // checker.checkGateways = function(gateways) {
        //   for (const gateway of gateways) {
        //     const node = new Node(this.results, gateway, this.nodes.length)
        //     this.nodes.push(node)
        //     this.results.append(node.tag)
        //     setTimeout(() => node.check(), 100 * this.nodes.length);
        //   }
        // }
        Checker.prototype.checkGateways = function (gateways) {
            var _loop_1 = function (gateway) {
                var node = new GatewayNode_1.GatewayNode(this_1.results, gateway, this_1.nodes.length);
                this_1.nodes.push(node);
                this_1.results.append(node.tag);
                setTimeout(function () { return node.check(); }, 100 * this_1.nodes.length);
            };
            var this_1 = this;
            for (var _i = 0, gateways_1 = gateways; _i < gateways_1.length; _i++) {
                var gateway = gateways_1[_i];
                _loop_1(gateway);
            }
        };
        return Checker;
    }());
    exports.Checker = Checker;
});
define("src/CheckBase", ["require", "exports", "src/UiComponent"], function (require, exports, UiComponent_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CheckBase = void 0;
    /**
     * Base Check functionality
     */
    var CheckBase = /** @class */ (function (_super) {
        __extends(CheckBase, _super);
        function CheckBase(parent) {
            var tagParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                tagParams[_i - 1] = arguments[_i];
            }
            var _this = _super.apply(this, __spreadArray([parent], tagParams, false)) || this;
            _this.parent = parent;
            _this._className = 'Not-set';
            _this._tagName = 'Not-set';
            return _this;
        }
        Object.defineProperty(CheckBase.prototype, "className", {
            get: function () {
                return this._className;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CheckBase.prototype, "tagName", {
            get: function () {
                return this._tagName;
            },
            enumerable: false,
            configurable: true
        });
        CheckBase.prototype.check = function () {
        };
        CheckBase.prototype.checked = function () {
        };
        CheckBase.prototype.onerror = function () {
            this.tag.err();
        };
        return CheckBase;
    }(UiComponent_5.UiComponent));
    exports.CheckBase = CheckBase;
});
define("src/app", ["require", "exports", "src/Checker", "src/Util"], function (require, exports, Checker_1, Util_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.OnScriptloaded = Util_6.Util.OnScriptloaded;
    window.checker = new Checker_1.Checker();
    fetch('./gateways.json')
        .then(function (res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, res.json()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); })
        .then(function (gateways) { return window.checker.checkGateways(gateways); });
});
define("gateways", [], [
    "https://ipfs.io/ipfs/:hash",
    "https://dweb.link/ipfs/:hash",
    "https://gateway.ipfs.io/ipfs/:hash",
    "https://ipfs.infura.io/ipfs/:hash",
    "https://infura-ipfs.io/ipfs/:hash",
    "https://ninetailed.ninja/ipfs/:hash",
    "https://10.via0.com/ipfs/:hash",
    "https://ipfs.eternum.io/ipfs/:hash",
    "https://hardbin.com/ipfs/:hash",
    "https://gateway.blocksec.com/ipfs/:hash",
    "https://cloudflare-ipfs.com/ipfs/:hash",
    "https://astyanax.io/ipfs/:hash",
    "https://cf-ipfs.com/ipfs/:hash",
    "https://ipns.co/ipfs/:hash",
    "https://ipfs.mrh.io/ipfs/:hash",
    "https://gateway.originprotocol.com/ipfs/:hash",
    "https://gateway.pinata.cloud/ipfs/:hash",
    "https://ipfs.doolta.com/ipfs/:hash",
    "https://ipfs.sloppyta.co/ipfs/:hash",
    "https://ipfs.busy.org/ipfs/:hash",
    "https://ipfs.greyh.at/ipfs/:hash",
    "https://gateway.serph.network/ipfs/:hash",
    "https://jorropo.net/ipfs/:hash",
    "https://gateway.temporal.cloud/ipfs/:hash",
    "https://ipfs.fooock.com/ipfs/:hash",
    "https://cdn.cwinfo.net/ipfs/:hash",
    "https://aragon.ventures/ipfs/:hash",
    "https://ipfs-cdn.aragon.ventures/ipfs/:hash",
    "https://permaweb.io/ipfs/:hash",
    "https://ipfs.stibarc.com/ipfs/:hash",
    "https://ipfs.best-practice.se/ipfs/:hash",
    "https://2read.net/ipfs/:hash",
    "https://ipfs.2read.net/ipfs/:hash",
    "https://storjipfs-gateway.com/ipfs/:hash",
    "https://ipfs.runfission.com/ipfs/:hash",
    "https://ipfs.trusti.id/ipfs/:hash",
    "https://ipfs.overpi.com/ipfs/:hash",
    "https://gateway.ipfs.lc/ipfs/:hash",
    "https://ipfs.leiyun.org/ipfs/:hash",
    "https://ipfs.ink/ipfs/:hash",
    "https://ipfs.oceanprotocol.com/ipfs/:hash",
    "https://d26g9c7mfuzstv.cloudfront.net/ipfs/:hash",
    "https://ipfsgateway.makersplace.com/ipfs/:hash",
    "https://gateway.ravenland.org/ipfs/:hash",
    "https://ipfs.funnychain.co/ipfs/:hash",
    "https://ipfs.telos.miami/ipfs/:hash",
    "https://robotizing.net/ipfs/:hash",
    "https://ipfs.mttk.net/ipfs/:hash",
    "https://ipfs.fleek.co/ipfs/:hash",
    "https://ipfs.jbb.one/ipfs/:hash",
    "https://ipfs.yt/ipfs/:hash",
    "https://jacl.tech/ipfs/:hash",
    "https://hashnews.k1ic.com/ipfs/:hash",
    "https://ipfs.vip/ipfs/:hash",
    "https://ipfs.k1ic.com/ipfs/:hash",
    "https://ipfs.drink.cafe/ipfs/:hash",
    "https://ipfs.azurewebsites.net/ipfs/:hash",
    "https://gw.ipfspin.com/ipfs/:hash",
    "https://ipfs.kavin.rocks/ipfs/:hash",
    "https://ipfs.denarius.io/ipfs/:hash",
    "https://ipfs.mihir.ch/ipfs/:hash",
    "https://bluelight.link/ipfs/:hash",
    "https://crustwebsites.net/ipfs/:hash",
    "http://3.211.196.68:8080/ipfs/:hash",
    "https://ipfs0.sjc.cloudsigma.com/ipfs/:hash",
    "https://ipfs-tezos.giganode.io/ipfs/:hash",
    "http://183.252.17.149:82/ipfs/:hash",
    "http://ipfs.genenetwork.org/ipfs/:hash",
    "https://ipfs.eth.aragon.network/ipfs/:hash",
    "https://ipfs.smartholdem.io/ipfs/:hash",
    "https://bin.d0x.to/ipfs/:hash",
    "https://ipfs.xoqq.ch/ipfs/:hash",
    "http://natoboram.mynetgear.com:8080/ipfs/:hash",
    "https://video.oneloveipfs.com/ipfs/:hash",
    "http://ipfs.anonymize.com/ipfs/:hash",
    "https://ipfs.noormohammed.tech/ipfs/:hash",
    "https://ipfs.taxi/ipfs/:hash",
    "https://ipfs.scalaproject.io/ipfs/:hash",
    "https://search.ipfsgate.com/ipfs/:hash",
    "https://ipfs.itargo.io/ipfs/:hash",
    "https://ipfs.decoo.io/ipfs/:hash",
    "https://ivoputzer.xyz/ipfs/:hash",
    "https://alexdav.id/ipfs/:hash",
    "https://ipfs.uploads.nu/ipfs/:hash",
    "https://hub.textile.io/ipfs/:hash",
    "https://ipfs1.pixura.io/ipfs/:hash",
    "https://ravencoinipfs-gateway.com/ipfs/:hash",
    "https://konubinix.eu/ipfs/:hash",
    "https://ipfs.clansty.com/ipfs/:hash",
    "https://3cloud.ee/ipfs/:hash",
    "https://ipfs.tubby.cloud/ipfs/:hash",
    "https://ipfs.lain.la/ipfs/:hash",
    "https://ipfs.adatools.io/ipfs/:hash",
    "https://ipfs.kaleido.art/ipfs/:hash",
    "https://ipfs.slang.cx/ipfs/:hash",
    "https://ipfs.arching-kaos.com/ipfs/:hash",
    "https://storry.tv/ipfs/:hash",
    "https://ipfs.kxv.io/ipfs/:hash",
    "https://ipfs-nosub.stibarc.com/ipfs/:hash",
    "https://ipfs.1-2.dev/ipfs/:hash",
    "https://dweb.eu.org/ipfs/:hash",
    "https://permaweb.eu.org/ipfs/:hash",
    "https://ipfs.namebase.io/ipfs/:hash",
    "https://ipfs.tribecap.co/ipfs/:hash",
    "https://ipfs.kinematiks.com/ipfs/:hash"
]);
//# sourceMappingURL=app.js.map