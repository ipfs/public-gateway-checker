import jsBeautify from 'js-beautify'
import { promises as fs } from 'fs'

const saveFile = process.argv.slice(2).includes('--fix')

const files = {
  'src/index.html': jsBeautify.html,
  'src/styles.css': jsBeautify.css
}

async function beautificationFn (filePath, fn) {
  console.log(`Checking ${filePath} formatting...`)
  const sourceCode = await fs.readFile(filePath, 'utf8')

  console.log(`Beautifying ${filePath}...`)
  const beautifiedCode = fn(sourceCode, {
    indent_size: 2,
    space_in_empty_paren: true,
    indent_char: ' ',
    indent_with_tabs: false,
    editorconfig: false,
    eol: '\n',
    end_with_newline: true,
    indent_level: 0
  })

  // lint mode.. fail if not beautified
  if (sourceCode === beautifiedCode) {
    console.log(`${filePath} is already beautified`)
    return
  } else if (!saveFile) {
    throw new Error(`${filePath} is not beautified`)
  }

  if (saveFile) {
    console.log(`Saving beautified ${filePath}`)
    await fs.writeFile(filePath, beautifiedCode, 'utf8')
  }
}

for (const [filePath, fn] of Object.entries(files)) {
  await beautificationFn(filePath, fn)
}
