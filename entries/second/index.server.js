import createApp from './index'

export default async (ctx) => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>second page</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
      ${ctx.frame.template.placeholders.head.style}
      ${ctx.frame.template.placeholders.head.link}
      ${ctx.frame.template.placeholders.head.script}
      </head>
      <body>
      ${ctx.frame.template.placeholders.body.root}
      ${ctx.frame.template.placeholders.body.script}
      </body>
  </html>`

  const { app, router } = createApp()

  return {
    app: createApp(),
    html
  }
}
