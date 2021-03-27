import { RSSFormat, RSSFormatList } from '@/common/type'
import config from '@/config'
import { Application, HttpError, validate } from '@cfworker/web'

import router from './router'

const formatPattern = /\/[a-zA-Z\d_-]+?\.([a-zA-Z\d_-]+)$/

const app = new Application()
  .use(
    validate({
      search: {
        properties: {
          f: {
            enum: RSSFormatList
          },
          format: {
            enum: RSSFormatList
          }
        }
      }
    })
  )
  .use(async (ctx, next) => {
    const { pathname } = ctx.req.url
    const search = ctx.req.url.searchParams
    const format =
      (pathname.match(formatPattern)?.[1] as RSSFormat | null) ??
      (search.get('format') as RSSFormat | null) ??
      (search.get('f') as RSSFormat | null) ??
      config.feed?.defaultFormat ??
      RSSFormat.ATOM
    if (!RSSFormatList.includes(format)) {
      throw new HttpError(
        400,
        JSON.stringify({
          error: `format ("${format}" given) should be one of ['rss', 'atom', 'json']`
        })
      )
    }

    ctx.req.url.pathname = pathname.replace(/\.(rss|atom|json)/, '')
    ctx.state.rssFormat = format

    await next()
  })
  .use(router.middleware)

export default app
