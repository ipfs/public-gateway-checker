import { UiComponent } from './UiComponent.js'
import type { GatewayNode } from './GatewayNode.js'

/**
 * Status is a summary column that shows overall gateway reachability.
 * It does not run any tests itself - it shows 🌍 if any test passed,
 * ❌ if all tests failed, or ↪️ if a redirect was detected.
 */
class Status extends UiComponent {
  private _up: boolean = false
  private _down: boolean = false
  constructor (readonly parent: GatewayNode) {
    super(parent, 'div', 'Status')
  }

  get down (): boolean {
    return this._down
  }

  set down (value: boolean) {
    if (!this.up && !this.down) {
      this._down = true
      this.tag.lose()
      this.tag.title = 'All tests failed'
    }
  }

  get up (): boolean {
    return this._up
  }

  set up (value: boolean) {
    if (!this.up && !this.down) {
      this._up = true
      if (this.parent.crossDomainRedirect != null) {
        this.tag.redirect(this.parent.crossDomainRedirect)
      } else {
        this.tag.global()
      }
      this.parent.tag.classList.add('online')
    }
  }

  /**
   * Update status to show redirect after initial display.
   * Called when a later test detects a redirect that wasn't known
   * when status.up was first set (e.g., Hotlink succeeded before
   * CORS detected the redirect).
   */
  updateForRedirect (): void {
    if (this._up && this.parent.crossDomainRedirect != null) {
      this.tag.redirect(this.parent.crossDomainRedirect)
    }
  }
}

export { Status }
