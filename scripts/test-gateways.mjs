import fs from 'node:fs/promises'
import dns from 'node:dns/promises'

// Parse the source of truth list of gateways
const gateways = (await fs.readFile('./gateways.txt')).toString().trim().split('\n')

const resolvableGateways = []

for (const gw of gateways) {
  const gwUrl = new URL(gw)
  try {
    await dns.lookup(gwUrl.hostname)
    resolvableGateways.push(gw)
  } catch (e) {
    console.log(`${gwUrl.hostname} does't resolve to any IPs. Consider removing`)
  }
}

// Update list of gateways only with resolveable domains
await fs.writeFile('./gateways.txt', resolvableGateways.join('\n').concat('\n'))
