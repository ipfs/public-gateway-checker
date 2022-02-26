import type { GatewayNode } from './GatewayNode'
import { UiComponent } from './UiComponent'
import { Util } from './Util'

// let Flag = function(parent, hostname) {
//   this.parent = parent;
//   this.tag = document.createElement("div");
//   this.tag.className = "Flag";
//   this.tag.textContent = '';

//   let ask = true;

//   try{
//     let savedSTR = localStorage.getItem(hostname);
//     if (savedSTR) {
//       let saved = JSON.parse(savedSTR);
//       let now = Date.now();
//       let savedTime = saved.time;
//       let elapsed = now - savedTime;
//       let expiration = 7 * 24 * 60 * 60 * 1000; // 7 days
//       if (elapsed < expiration) {
//         ask = false;
//         this.onResponse(saved);
//       }
//     }
//   } catch(e) {
//     console.error(`error while getting savedSTR for ${hostname}`, e)
//   }

//   if (ask) {
//     setTimeout(() => {
//       let request = new XMLHttpRequest();
//       request.open('GET', `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`);
//       request.setRequestHeader("accept", "application/dns-json");
//       request.onreadystatechange = async () => {
//         if (4 == request.readyState) {
//           if (200 == request.status) {
//             try {
//               let response = JSON.parse(request.responseText);
//               let ip = null;
//               for (let i = 0; i < response.Answer.length && !ip; i++) {
//                 let answer = response.Answer[i];
//                 if (1 == answer.type) {
//                   ip = answer.data;
//                 }
//               }
//               if (ip) {
//                 let geoipResponse = await window.IpfsGeoip.lookup(ipfs_http_client, ip);
//                 if (geoipResponse && geoipResponse.country_code) {
//                   this.onResponse(geoipResponse);
//                   geoipResponse.time = Date.now();
//                   let resposeSTR = JSON.stringify(geoipResponse);
//                   localStorage.setItem(hostname, resposeSTR);
//                 }
//               }
//             } catch(e) {
//               console.error(`error while getting DNS A record for ${hostname}`, e)
//             }
//           }
//         }
//       };
//       request.onerror = (e) => {};
//       request.send();
//     }, 500 * Flag.requests++); // 2 / second, request limit
//   }
// };
class Flag extends UiComponent {
  // Flag.requests = 0;
  private static requests = 0
  constructor (protected parent: GatewayNode, private readonly hostname: string) {
    super(parent, 'div', 'Flag')

    this.setup()
  }

  setup () {
    let ask = true

    try {
      const savedSTR = localStorage.getItem(this.hostname)
      if (savedSTR) {
        const saved = JSON.parse(savedSTR)
        const now = Date.now()
        const savedTime = saved.time
        const elapsed = now - savedTime
        const expiration = 7 * 24 * 60 * 60 * 1000 // 7 days
        if (elapsed < expiration) {
          ask = false
          this.onResponse(saved)
        }
      }
    } catch (e) {
      console.error(`error while getting savedSTR for ${this.hostname}`, e)
    }

    if (ask) {
      setTimeout(() => {
        const request = new XMLHttpRequest()
        request.open('GET', `https://cloudflare-dns.com/dns-query?name=${this.hostname}&type=A`)
        request.setRequestHeader('accept', 'application/dns-json')
        request.onreadystatechange = async () => {
          if (request.readyState == 4) {
            if (request.status == 200) {
              try {
                const response = JSON.parse(request.responseText)
                let ip = null
                for (let i = 0; i < response.Answer.length && !ip; i++) {
                  const answer = response.Answer[i]
                  if (answer.type == 1) {
                    ip = answer.data
                  }
                }
                if (ip) {
                  const geoipResponse = await window.IpfsGeoip.lookup(Util.ipfs_http_client, ip)
                  if (geoipResponse && geoipResponse.country_code) {
                    this.onResponse(geoipResponse)
                    geoipResponse.time = Date.now()
                    const resposeSTR = JSON.stringify(geoipResponse)
                    localStorage.setItem(this.hostname, resposeSTR)
                  }
                }
              } catch (e) {
                console.error(`error while getting DNS A record for ${this.hostname}`, e)
              }
            }
          }
        }
        request.onerror = (e) => { }
        request.send()
      }, 500 * Flag.requests++) // 2 / second, request limit
    }
  }

  // Flag.prototype.onResponse = function(response) {
  //   this.tag.style["background-image"] = `url('https://ipfs.io/ipfs/QmaYjj5BHGAWfopTdE8ESzypbuthsZqTeqz9rEuh3EJZi6/${response.country_code.toLowerCase()}.svg')`;
  //   this.tag.title = response.country_name;
  // };
  onResponse (response: IpfsGeoip.LookupResponse) {
    this.tag.style['background-image'] = `url('https://ipfs.io/ipfs/QmaYjj5BHGAWfopTdE8ESzypbuthsZqTeqz9rEuh3EJZi6/${response.country_code.toLowerCase()}.svg')`
    this.tag.title = response.country_name
  }
}

export { Flag }
