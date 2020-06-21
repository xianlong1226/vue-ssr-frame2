const Koa = require('koa')
const serve = require('koa-static2')
const path = require('path')
const fs = require('fs')
const serverRender = require('vue-server-renderer')
const { publicPath } = require('./config.json')

const app = new Koa()
const renderer = serverRender.createRenderer()
const publishPath = path.join(__dirname, publicPath)

app.use(serve(publicPath.replace(/\//g, ''), publishPath))

app.use(async ctx => {
  const url = ctx.url

  if (url.startsWith('favicon.ico')) {
    return
  }

  if (url.startsWith(publicPath)) {
    return
  }

  const manifestPath = path.join(publishPath, '/manifest.json')
  let entryFilePathConfig = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).files[url.substring(1)]

  ctx.frame = {
    template: {
      placeholders: {
        head: {
          style: '<!--HEADER-STYLE-OCCUPIED -->',
          link: '<!--HEADER-LINK-OCCUPIED -->',
          script: '<!--HEADER-SCRIPT-OCCUPIED -->'
        },
        body: {
          root: '<!--BODY-CONTENT-OCCUPIED -->',
          script: '<!--BODY-SCRIPT-OCCUPIED -->'
        }
      }
    }
  }

  const nodeFilePath = entryFilePathConfig.node.find(filePath => {
    if (filePath.indexOf('node') != -1 && !filePath.endsWith('map')) {
      return true
    }
    return false
  })
  const createApp = require(path.join(__dirname, nodeFilePath)).default

  const scripts = [], links = []
  entryFilePathConfig.page.forEach(filePath => {
    if (filePath.endsWith('.js')) {
      scripts.push(`<script type="text/javascript" src="${filePath}"></script>`)
    }

    if (filePath.endsWith('.css')) {
      links.push(`<link type="text/css" rel="stylesheet" href="${filePath}" />`)
    }
  })

  const { app, html } = await createApp(ctx)

  // 不进行服务器端渲染
  if (!app) {
    return ctx.body = html.replace(ctx.frame.template.placeholders.head.style, '')
              .replace(ctx.frame.template.placeholders.head.link, links.join(''))
              .replace(ctx.frame.template.placeholders.head.script, '')
              .replace(ctx.frame.template.placeholders.body.root, '<div id="app"></div>')
              .replace(ctx.frame.template.placeholders.body.script, scripts.join(''))
  }

  // 进行服务器端渲染
  renderer.renderToString(app, (err, renderHtml) => {
    if (err) {
      return ctx.body = err.stack
    }

    ctx.body = html.replace(ctx.frame.template.placeholders.head.style, '')
              .replace(ctx.frame.template.placeholders.head.link, links.join(''))
              .replace(ctx.frame.template.placeholders.head.script, '')
              .replace(ctx.frame.template.placeholders.body.root, renderHtml)
              .replace(ctx.frame.template.placeholders.body.script, scripts.join(''))
  })
})

app.listen(3000, function() {
  console.log('server start listen 3000')
})
