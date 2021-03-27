import { Middleware } from '@cfworker/web'
import { js2xml, ElementCompact } from 'xml-js'

import { Changefreq, Route, SitemapItem } from '@/common/type'
import config from '@/config'
import { clog } from '@/common/toolkit'

export const genXML = (urls: SitemapItem[]) => {
  const base: ElementCompact = {
    _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
    urlset: {
      _attributes: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
      url: urls.map(e => {
        return {
          loc: {
            _text: e.loc
          },
          lastmod: e.lastmod && {
            _text: e.lastmod.toDateString()
          },
          changefreq: {
            _text: e.changefreq
          },
          priority: {
            _text: e.priority
          }
        }
      })
    }
  }
  return js2xml(base, { compact: true, ignoreComment: true })
}

export const sitemapMiddlewareFactory: (
  routes: Route[]
) => Middleware = routes => ctx => {
  const urls: SitemapItem[] = [
    ...routes.map(e => {
      return {
        loc: config.basePath + e.path,
        changefreq: e.init?.changefreq ?? Changefreq.Daily,
        lastmod: new Date(), // TODO: use lastmod in metadata
        priority: 0.4
      }
    })
  ]
  ctx.respondWith(
    new Response(clog(genXML(urls)), {
      headers: {
        'Content-type': 'application/xml; charset="utf-8"'
      }
    })
  )
}
