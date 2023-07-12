import { URL } from 'url-ponyfill'
import { Log } from './Log'
import { UiComponent } from './UiComponent'
import { checkViaImgSrc } from './checkViaImgSrc'
import { IMG_HASH } from './constants'
import type { GatewayNode } from './GatewayNode'

const log = new Log('Status')

class Status extends UiComponent {
  private _up: boolean = false
  private _down: boolean = false
  constructor (readonly parent: GatewayNode) {
    super(parent, 'div', 'Status')
  }

  async check (): Promise<void> {
    // test by loading subresource via img.src (path will work on both old and subdomain gws)
    const gwUrl = new URL(this.parent.gateway)
    const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
    await checkViaImgSrc(imgPathUrl).catch((err) => {
      if (err != null) {
        log.error(this.parent.gateway, err)
      }
      // this.down = true
      // we check this because the gateway could be already checked by CORS before onerror executes
      // and, even though it is failing here, we know it is UP
      // if (!this.up) {
      //   this.down = false
      //   // this.tag.textContent = '❌'
      //   this.tag.lose()
      //   // this.parent.failed()
      // }
      throw err
    })
  }

  get down (): boolean {
    return this._down
  }

  set down (value: boolean) {
    if (!this.up && !this.down) {
      this._down = true
      this.tag.lose()
    }
  }

  get up (): boolean {
    return this._up
  }

  set up (value: boolean) {
    if (!this.up && !this.down) {
      this._up = true
      this.tag.global()
      this.parent.tag.classList.add('online')
    }
  }

  // checked () {
  //   // this.up = true
  //   // this.tag.global()
  // }

  onerror (): void {
    throw new Error('Not implemented')
  }
}

export { Status }
