import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const htmlPath = resolve(root, 'dist/index.html')

let html = readFileSync(htmlPath, 'utf8')

html = html.replace(
  /<script type="module" crossorigin src="(\.\/assets\/[^"]+\.js)"><\/script>/,
  (_tag, src) => {
    const js = readFileSync(resolve(root, 'dist', src), 'utf8')
      .replace(/<\/script/gi, '<\\/script')
    return `<script type="module">\n${js}\n</script>`
  }
)

html = html.replace(
  /<link rel="stylesheet" crossorigin href="(\.\/assets\/[^"]+\.css)">/,
  (_tag, href) => {
    const css = readFileSync(resolve(root, 'dist', href), 'utf8')
      .replace(/<\/style/gi, '<\\/style')
    return `<style>\n${css}\n</style>`
  }
)

writeFileSync(htmlPath, html)
