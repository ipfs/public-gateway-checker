import { URL } from 'url-ponyfill'

import { Cors } from './Cors'
import { Flag } from './Flag'
import { Origin } from './Origin'
import type { Results } from './Results'
import { Status } from './Status'
import { UiComponent } from './UiComponent'
import { Util } from './Util'
import { Log } from './Log'

const log = new Log('GatewayNode')

class GatewayNode extends UiComponent /* implements Checkable */ {
  // tag: Tag
  status: Status
  cors: Cors
  origin: Origin
  link: HTMLDivElement & { url?: URL }
  flag: Flag
  took: HTMLDivElement
  gateway: string
  index: unknown
  checkingTime: number

  doneChecking = false
  online = false

  constructor (readonly parent: Results, gateway: string, index: unknown) {
    super(parent, 'div', 'Node')

    this.tag.empty()

    this.tag.style.order = Date.now().toString()

    this.status = new Status(this)
    this.tag.append(this.status.tag)

    this.cors = new Cors(this)
    this.tag.append(this.cors.tag)

    this.origin = new Origin(this)
    this.tag.append(this.origin.tag)

    this.link = document.createElement('div')
    const gatewayAndHash = gateway.replace(':hash', Util.HASH_TO_TEST)
    this.link.url = new URL(gatewayAndHash)
    this.link.textContent = Util.gatewayHostname(this.link.url)
    this.link.className = 'Link'

    this.flag = new Flag(this, this.link.textContent)
    this.tag.append(this.flag.tag)
    this.tag.append(this.link)

    this.took = document.createElement('div')
    this.took.className = 'Took'
    this.tag.append(this.took)

    this.gateway = gateway
    this.index = index
    this.checkingTime = 0
  }

  public async check () {
    this.checkingTime = Date.now()
    const checks = [this.flag.check(), this.status.check(), this.cors.check(), this.origin.check()]

    // we care only about the fastest method to return a success
    Promise.race(checks).then(this.checked.bind(this)).catch((err) => {
      log.error(err)
    })

    await Promise.all(checks)
  }

  private checked () {
    if (!this.doneChecking) {
      this.doneChecking = true
      this.status.checked()
      // this.parent.checked()
      const url = this.link.url
      if (url != null) {
        const host = Util.gatewayHostname(url)
        this.link.innerHTML = `<a title="${host}" href="${url.toString()}#x-ipfs-companion-no-redirect" target="_blank">${host}</a>`
      }
      const ms = Date.now() - this.checkingTime
      this.tag.style.order = ms.toString()
      const s = (ms / 1000).toFixed(2)
      this.took.textContent = `${s}s`
    } else {
      log.warn('"checked" method called more than once.. potential logic error')
    }
  }

  onerror () {
    this.tag.err()
  }
}

export { GatewayNode }
