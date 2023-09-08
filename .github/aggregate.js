const fs = require('fs')
const process = require('process')
const path = require('path')

/**
 * @typedef {Object} MetaInput
 * @property {string} [version]
 * @property {string} [group]
 * @property {string} [job_url]
 * @property {string} [gateway_url]
 * @property {string[]} [specs]
 */

/**
 * @typedef {'pass' | 'fail' | 'skip'} TestOutcome
 */

/**
 * @typedef {Object} TestItemInput
 * @property {string[]} path
 * @property {string} time
 * @property {TestOutcome} outcome
 * @property {string} [output]
 * @property {MetaInput} [meta]
 */

/**
 * @typedef {Object.<string, TestItemInput>} ReportFileInput
 */

/**
 * @typedef {Object} ReportMetaOutput
 * @property {string} time
 * @property {string} [version]
 * @property {string} [job_url]
 * @property {string} [gateway_url]
 */

/**
 * @typedef {Object} ReportOutput
 * @property {ReportMetaOutput} metadata
 * @property {Object.<string, { pass: number, fail: number, skip: number, group: string }>} results
 */

/** @typedef {[string, { outcome: string, group: string }]} TestTuple */

/**
 * List of json reports to aggregate.
 * @type {string[]}
 */
const inputs = process.argv.slice(2)

/**
 * Processes a report from a given filePath and extracts important data.
 *
 * @param {string} filePath - The path to the JSON report file.
 * @returns {[string, ReportOutput]} Returns a tuple with the gateway_url and processed report data.
 */
const processReport = (filePath) => {
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  /** @type {ReportFileInput} */
  const reportContent = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))

  // extract the TestMetadata
  const { TestMetadata, ...allOtherTests } = reportContent
  const { time, meta } = TestMetadata || {}
  const { version, job_url, gateway_url } = meta || {}

  // Then extract the test results we care about.
  const groups = Object.entries(allOtherTests)
    // keep only the tests at the root
    .filter(([_, value]) => value.path.length === 1)
    // keep only the outcomes and groups
    .map(/** @returns {TestTuple} */ ([key, value]) => {
      const result = {
        outcome: value.outcome,
        group: value.meta?.group ?? 'Others',
      }

      return [key, result]
    })
    // then group by "group" value and sum their outcomes
    .reduce((acc, [_key, value]) => {
      /** @type {{ outcome: string, group: string }} */
      const { outcome, group } = value

      if (!acc[group]) {
        acc[group] = {
          pass: 0,
          fail: 0,
          skip: 0,
        }
      }

      acc[group][outcome] += 1

      return acc
    }, {})

  if (!gateway_url) {
    throw new Error(`gateway_url is missing from ${filePath}`)
  }

  return [
    gateway_url,
    {
      metadata: {
        time, version, job_url, gateway_url,
      },
      results: groups,
    },
  ]
}

/**
 * Main function to process all input files and write the results to standard output.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
  /** @type {Object<string, ReportOutput>} */
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
