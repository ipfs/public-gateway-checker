import { URL } from 'url-ponyfill'
import { Cors } from './Cors.js'
import { Flag } from './Flag.js'
import { Hotlink } from './Hotlink.js'
import { IPNSCheck } from './Ipns.js'
import { Log } from './Log.js'
import { Origin } from './Origin.js'
import { Status } from './Status.js'
import { Trustless } from './Trustless.js'
import { UiComponent } from './UiComponent.js'
import { HASH_TO_TEST, SLOW_TESTS_DELAY } from './constants.js'
import { detectCrossDomainRedirect } from './detectCrossDomainRedirect.js'
import { gatewayHostname } from './gatewayHostname.js'
import type { Results } from './Results.js'
import type { RedirectDetectionResult } from './detectCrossDomainRedirect.js'

const log = new Log('GatewayNode')

class GatewayNode extends UiComponent /* implements Checkable */ {
  // tag: Tag
  status: Status
  hotlink: Hotlink
  cors: Cors
  ipns: IPNSCheck
  origin: Origin
  trustless: Trustless
  link: HTMLDivElement & { url?: URL }
  flag: Flag
  took: HTMLDivElement
  gateway: string
  index: unknown
  checkingTime: number

  atLeastOneSuccess = false
  crossDomainRedirect: string | null = null
  // Shared redirect detection result (run once, used by all tests)
  redirectDetection: RedirectDetectionResult = { confirmedTarget: null, possibleRedirect: false, errorStatus: null }

  constructor (readonly parent: Results, gateway: string, index: unknown) {
    super(parent, 'div', 'Node')

    this.tag.empty()

    this.tag.style.order = Date.now().toString()

    this.status = new Status(this)
    this.tag.append(this.status.tag)

    this.hotlink = new Hotlink(this)
    this.tag.append(this.hotlink.tag)

    this.cors = new Cors(this)
    this.tag.append(this.cors.tag)

    this.ipns = new IPNSCheck(this)
    this.tag.append(this.ipns.tag)

    this.origin = new Origin(this)
    this.tag.append(this.origin.tag)

    this.trustless = new Trustless(this)
    this.tag.append(this.trustless.tag)

    this.link = document.createElement('div')
    const gatewayAndHash = `${gateway}/ipfs/${HASH_TO_TEST}`
    this.link.url = new URL(gatewayAndHash)
    this.link.textContent = gatewayHostname(this.link.url)
    this.link.className = 'Link'

    this.flag = new Flag(this, this.link.textContent)
    // this.link.prepend(this.flag.tag.element)
    this.tag.append(this.flag.tag)
    this.tag.append(this.link)

    this.took = document.createElement('div')
    this.took.className = 'Took'
    this.tag.append(this.took)

    this.gateway = gateway
    this.index = index
    this.checkingTime = 0
  }

  public async check (): Promise<void> {
    this.checkingTime = Date.now()
    const onSuccess = this.onSuccessfulCheck.bind(this)

    void this.flag.check().then(() => { log.debug(this.gateway, 'Flag success') })

    // Start Hotlink immediately (fastest, lightest test - browser-native img loading)
    const hotlinkPromise = this.hotlink.check()
      .then(() => { log.debug(this.gateway, 'Hotlink success') })
      .then(onSuccess)
      .catch(() => { log.debug(this.gateway, 'Hotlink failed') })

    // Delay other tests to give Hotlink exclusive network access
    const delayedTestsPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        // Run redirect detection once, share result with all tests
        const testUrl = `${this.gateway}/ipfs/${HASH_TO_TEST}?now=${Date.now()}#x-ipfs-companion-no-redirect`
        void detectCrossDomainRedirect(testUrl, this.gateway).then((result) => {
          this.redirectDetection = result
          if (result.confirmedTarget != null) {
            this.crossDomainRedirect = result.confirmedTarget
          }
          // Now start all tests (they use this.redirectDetection)
          const otherTests = [
            this.cors.check()
              .then(() => { log.debug(this.gateway, 'CORS success') })
              .then(onSuccess),
            this.ipns.check()
              .then(() => { log.debug(this.gateway, 'IPNS success') })
              .then(onSuccess),
            this.origin.check()
              .then(() => { log.debug(this.gateway, 'Origin success') })
              .then(onSuccess),
            this.trustless.check()
              .then(() => { log.debug(this.gateway, 'Trustless success') })
              .then(onSuccess)
          ]
          void Promise.allSettled(otherTests).then(() => { resolve() })
        })
      }, SLOW_TESTS_DELAY)
    })

    // Wait for both Hotlink and delayed tests to complete
    await Promise.allSettled([hotlinkPromise, delayedTestsPromise])

    // Set status.down only if ALL tests failed
    if (!this.atLeastOneSuccess) {
      this.status.down = true
      log.debug(`Gateway '${this.gateway}' - all tests failed`)
    }
  }

  private onSuccessfulCheck (): void {
    if (!this.atLeastOneSuccess) {
      log.info(`For gateway '${this.gateway}', at least one check was successful`)
      this.atLeastOneSuccess = true
      this.status.up = true
      const url = this.link.url
      if (url != null) {
        const host = gatewayHostname(url)
        this.link.innerHTML = `<a title="${host}" href="${url.toString()}#x-ipfs-companion-no-redirect" target="_blank">${host}</a>`
      }
      const ms = Date.now() - this.checkingTime
      this.tag.style.order = ms.toString()
      const s = (ms / 1000).toFixed(2)
      this.took.textContent = `${s}s`
    }
    // Update status if a later test detected a redirect
    // (e.g., Hotlink succeeded first, then CORS detected redirect)
    if (this.crossDomainRedirect != null) {
      this.status.updateForRedirect()
    }
  }

  // private checked () {
  //   if (!this.doneChecking) {
  //     this.doneChecking = true
  //     // this.status.checked()
  //     // this.parent.checked()
  //   } else {
  //     log.warn('"checked" method called more than once.. potential logic error')
  //   }
  // }

  onerror (): void {
    this.tag.err()
  }
}

export { GatewayNode }
