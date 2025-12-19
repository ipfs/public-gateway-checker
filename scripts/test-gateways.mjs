import fs from 'node:fs/promises'
import dns from 'node:dns/promises'
import http from 'node:http'
import https from 'node:https'

const timeout = 5000

function makeRequest (url) {
  return new Promise((resolve, reject) => {
    let responseBody = ''
    const opts = {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.ipld.raw'
      }
    }
    const protocolModule = new URL(url).protocol === 'https:' ? https : http
    const req = protocolModule.request(url, opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return makeRequest(new URL(res.headers.location), opts).then(resolve, reject)
      }
      res.on('data', (chunk) => {
        responseBody += chunk
      })
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: responseBody, headers: res.headers })
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.setTimeout(timeout, () => {
      req.destroy()
      reject(new Error(`HTTP GET timed out after ${timeout}ms`))
    })

    req.end()
  })
}

function trim (str) {
  return str.length > 7 ? str.slice(0, 7) + '...' : str
}

const shouldPrune = process.argv.includes('--prune')

;(async () => {
  const gateways = JSON.parse(await fs.readFile('./gateways.json'))
  const resolvableGateways = []

  for (const gw of gateways) {
    const gwUrl = new URL(gw)
    if (gwUrl.hostname.endsWith('.onion')) {
      resolvableGateways.push(gw)
      continue
    }
    try {
      await dns.lookup(gwUrl.hostname)

      const url = `${gw}/ipfs/bafkqablimvwgy3y?format=raw`

      const { statusCode, body, headers } = await makeRequest(url)
      if (statusCode < 200 || statusCode >= 400) {
        console.log(`\x1b[31mERROR\x1b[0m: ${gwUrl.hostname} received ${statusCode} response for ${url}. Expected status 2XX or 3XX`)
        continue
      }
      if (body !== 'hello') {
        console.log(`\x1b[31mERROR\x1b[0m: ${gwUrl.hostname} returned body '${trim(body)}' does not match test plain text block for ${url}. Expected 'hello'`)
        continue
      }
      const ctype = headers['content-type']
      if (ctype !== 'application/vnd.ipld.raw') {
        console.log(`\x1b[33mWARN\x1b[0m:  ${gwUrl.hostname} returned Content-Type: ${ctype} for ${url}. Expected application/vnd.ipld.raw`)
        // body matches, so gateway works, but does not support trustless responses, which should be standard, thus warning
      } else {
        console.log(`\x1b[32mOK\x1b[0m:    ${gwUrl.hostname}`)
      }
      resolvableGateways.push(gw)
    } catch (e) {
      console.error(`\x1b[31mERROR\x1b[0m: ${gwUrl.hostname} DNS or HTTP failure:`, e.message)
    }
  }

  if (shouldPrune) {
    await fs.writeFile('./gateways.json', JSON.stringify(resolvableGateways, null, '  '))
    console.log(`\nPruned gateways.json: ${gateways.length} → ${resolvableGateways.length}`)
  }
})()
