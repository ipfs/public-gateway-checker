import { CheckBase } from './CheckBase'
import { ipfsHttpClient } from './ipfsHttpClient'
import { Log } from './Log'

import type { GatewayNode } from './GatewayNode'
import { DEFAULT_IPFS_CLIENT_OPTIONS } from './constants'

const log = new Log('Writable')

class Writable extends CheckBase implements Checkable {
  _className = 'Writable'
  _tagName = 'div'
  constructor (protected parent: GatewayNode) {
    super(parent, 'div', 'Writable')
  }

  async check (): Promise<void> {
    const now = Date.now()
    const { host } = new URL(this.parent.gateway)
    try {
      const ipfsClientInstance = ipfsHttpClient.create({ ...DEFAULT_IPFS_CLIENT_OPTIONS, host })
      const fileName = `writable-test-${now}.txt`
      const file = {
        path: `/tmp/${fileName}`,
        content: `Sample Request at timestamp: ${now}`
      }
      const writeResult = await ipfsClientInstance.add(file)
      const resultPath = `${this.parent.gateway.replace(':hash', writeResult.cid.toString())}/${fileName}`
      log.debug(`Write succeed to host ${host}, at ${resultPath}`)
      this.tag.win(resultPath)
    } catch (err) {
      log.error(`Write request to '${host} failed with error: ${err as string}`)
      this.onerror()
      throw err
    }
  }

  checked (): void {
    log.warn('Not implemented yet')
  }

  onerror (): void {
    this.tag.lose()
  }
}

export { Writable }
