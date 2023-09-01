const fs = require('fs')
const process = require('process')
const path = require('path')

// params: list of json reports to aggregate
const inputs = process.argv.slice(2)

const processReport = (filePath) => {
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  const json = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))

  // extract the TestMetadata
  const { TestMetadata, ...rest } = json
  const { time, meta } = TestMetadata || {}
  const { version, job_url, gateway_url } = meta || {}

  // and the data we care about.
  // keep only the tests at the root
  const entries = Object.entries(rest)
  const roots = entries
    .filter(([_, value]) => value.path.length === 1)
    .map(([key, value]) => {
      const result = {
        outcome: value.outcome,
      }

      return [key, result]
    })

  return [
    gateway_url,
    {
      metadata: {
        time, version, job_url, gateway_url,
      },
      results:
        Object.fromEntries(
          roots,
        ),
    },
  ]
}

const main = async () => {
  const results = {}

  inputs.forEach((filePath) => {
    const [name, report] = processReport(filePath)
    results[name] = report
  })

  fs.writeFileSync(1, JSON.stringify(results, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
