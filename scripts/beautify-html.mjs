import jsBeautify from 'js-beautify'
import { promises as fs } from 'fs'

const beautify = jsBeautify.html
const saveFile = process.argv.slice(2).includes('--fix')

console.log('Checking index.html formatting...')
const htmlSrc = await fs.readFile('src/index.html', 'utf8')

console.log('Beautifying HTML...')
const beautifiedHtml = beautify(htmlSrc, {
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
if (htmlSrc === beautifiedHtml) {
  console.log('HTML is already beautified')
  process.exit(0)
} else if (!saveFile) {
  console.error('HTML is not beautified')
  process.exit(1)
}

if (saveFile) {
  console.log('Saving beautified HTML')
  await fs.writeFile('src/index.html', beautifiedHtml, 'utf8')
}
