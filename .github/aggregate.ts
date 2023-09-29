import fs  from 'fs'
import process from 'process'
import path from 'path'
import { z } from 'zod'

interface ReportOutput {
  metadata: {
    time: string
    version?: string
    job_url?: string
    gateway_url: string
  }
  results: {
    [key: string]: {
      pass: number
      fail: number
      skip: number
    }
  }
}

type GatewayURL = string

// At the moment test2json is likely to miss some outputs.
// We'll accept "Unknown" as a valid outcome for now.
// Related: https://github.com/golang/go/issues/61767
const Outcome = z.enum(['pass', 'fail', 'skip', 'Unknown'])

const ReportFileInput = z.intersection(
  z.record(z.object({
    path: z.array(z.string()),
    time: z.string(),
    outcome: Outcome,
    output: z.string().optional(),
    meta: z.object({
      group: z.string().optional(),
    }).optional(),
  })),
  z.object({
    TestMetadata: z.object({
      time: z.string(),
      meta: z.object({
        version: z.string().optional(),
        job_url: z.string().optional(),
        gateway_url: z.string(),
      })
    }).optional(),
  })
)

/**
 * Processes a report from a given filePath and extracts important data.
 */
const processReport = (filePath: string): [GatewayURL, ReportOutput] => {
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  const { TestMetadata, ...allOtherTests } = ReportFileInput.parse(JSON.parse(fs.readFileSync(resolvedPath, 'utf8')))


  if (!TestMetadata) {
    throw new Error(`No TestMetadata found in ${resolvedPath}`)
  }

  const { time, meta } = TestMetadata
  const { version, job_url, gateway_url } = meta

  // Then extract the test results we care about.
  const groups = Object.entries(allOtherTests)
    .filter(([_, value]) => value.path.length === 1) // keep only the tests at the root
    .map(([_key, value]) => {
      // keep only the outcomes and groups
      return {
        outcome: value.outcome,
        group: value.meta?.group ?? 'Others',
      }
    })
    .reduce((acc, value) => {
      // then group by "group" value and sum their outcomes
      const { group } = value
      const outcome = value.outcome === 'Unknown' ? 'fail' : value.outcome

      if (!acc[group]) {
        acc[group] = {
          pass: 0,
          fail: 0,
          skip: 0,
        }
      }

      acc[group][outcome] += 1

      return acc
    }, {} as ReportOutput['results'])

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
 */
const main = async (): Promise<void> => {
  const inputs: string[] = process.argv.slice(2) // List of json reports to aggregate.

  const results: {[key: string]: ReportOutput} = {}
  
  inputs.forEach((filePath) => {
    try {
      const [name, report] = processReport(filePath)
      results[name] = report
    } catch (err) {
      console.error(`Error processing ${filePath}`, err)
    }
  })

  fs.writeFileSync(1, JSON.stringify(results, null, 2) + '\n')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
