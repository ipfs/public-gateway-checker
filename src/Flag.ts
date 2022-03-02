import type { GatewayNode } from './GatewayNode'
import { Log } from './Log'
import { UiComponent } from './UiComponent'
import { ipfsHttpClient } from './ipfsHttpClient'

const log = new Log('Flag')

class Flag extends UiComponent {
  private static requests = 0
  constructor (protected parent: GatewayNode, private readonly hostname: string) {
    super(parent, 'div', 'Flag')

    this.setup()
  }

  setup () {
    let ask = true

    try {
      const savedSTR = localStorage.getItem(this.hostname)
      if (savedSTR != null) {
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
      log.error(`error while getting savedSTR for ${this.hostname}`, e)
      this.onError()
    }

    if (ask) {
      setTimeout(this.dnsRequest.bind(this), 500 * Flag.requests++) // 2 / second, request limit
    }
  }

  private dnsRequest () {
    const request = new XMLHttpRequest()
    request.open('GET', `https://cloudflare-dns.com/dns-query?name=${this.hostname}&type=A`)
    request.setRequestHeader('accept', 'application/dns-json')
    request.onreadystatechange = async () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          await this.handleSuccessfulRequest(request)
        }
      }
    }
    request.onerror = (err) => {
      log.error(err)
      this.onError()
    }
    request.send()
  }

  async handleSuccessfulRequest (request: XMLHttpRequest) {
    try {
      const response = JSON.parse(request.responseText)
      if (response.Answer == null) {
        log.error('Response does not contain the "Answer" property:', request.responseText)
        return this.onError()
      }
      let ip = null
      for (let i = 0; i < response.Answer.length && ip == null; i++) {
        const answer = response.Answer[i]
        if (answer.type === 1) {
          ip = answer.data
        }
      }
      if (ip != null) {
        const geoipResponse = await window.IpfsGeoip.lookup(ipfsHttpClient, ip)
        if (geoipResponse?.country_code != null) {
          this.onResponse(geoipResponse)
          geoipResponse.time = Date.now()
          const responseSTR = JSON.stringify(geoipResponse)
          localStorage.setItem(this.hostname, responseSTR)
        }
      }
    } catch (e) {
      log.error(`error while getting DNS A record for ${this.hostname}`, e)
      this.onError()
    }
  }

  private onError () {
    this.tag.err()
  }

  onResponse (response: IpfsGeoip.LookupResponse) {
    this.tag.style['background-image'] = `url('https://ipfs.io/ipfs/QmaYjj5BHGAWfopTdE8ESzypbuthsZqTeqz9rEuh3EJZi6/${response.country_code.toLowerCase()}.svg')`
    this.tag.title = response.country_name
    this.tag.empty() // remove textContent icon since we're using a background image
  }
}

export { Flag }
