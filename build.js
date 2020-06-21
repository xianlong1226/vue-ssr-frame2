const webpack = require("webpack")
const colors = require('colors')
const path = require('path')
const fs = require('fs-extra')
const pageConfig = require('./webpack.web.js')
const nodeConfig = require('./webpack.node.js')
const { publicPath } = require('./config.json')

const publishPath = path.join(__dirname, publicPath)

function fixPathSlash (pathToFix) {
  return pathToFix.replace(/\\/g, '/')
}

function callback (err, statses) {
  if (err || statses.hasErrors()) {
    console.log(colors.red('编译报错' + statses.toString()))
    return
  }

  const manifestPath = path.join(publishPath, 'manifest.json')
  let manifest = {}

  if (fs.existsSync(manifestPath)) {
    manifest = fs.readFileSync(manifestPath, 'utf-8')
    manifest = JSON.parse(manifest)
  } else {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8')
  }

  Object.assign(manifest, {
    time: new Date(),
    hash: statses.hash
  })
  if (!manifest.files) {
    manifest.files = {}
  }

  statses.stats.forEach(stats => {
    const target = stats.compilation.options.target

    const commonChunk = stats.compilation.chunks.find((chunk) => chunk.name === 'common')

    stats.compilation.chunks.forEach((chunk) => {
      const name = chunk.name
      if (name === 'common') return

      const urlPath = name.replace(/\./g, '/')

      const files = chunk.files.concat(commonChunk ? commonChunk.files : []).map((file) => {
        return fixPathSlash(path.join(publicPath, file))
      })

      if (!manifest.files[urlPath]) {
        manifest.files[urlPath] = { page: [], node: [] }
      }
      
      if (target === 'node') {
        manifest.files[urlPath].node = files
      } else {
        manifest.files[urlPath].page = files
      }
    })
  })

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(colors.green('编译完成...'))
}

fs.emptyDirSync(publishPath)
fs.ensureDirSync(publishPath)

console.log(colors.green('开始编译...'))
const compiler = webpack([pageConfig, nodeConfig])
compiler.watch({}, callback)
