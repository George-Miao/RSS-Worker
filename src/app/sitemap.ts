import { Middleware } from '@cfworker/web'
import { js2xml, ElementCompact } from 'xml-js'

import { Changefreq, Route, SitemapItem } from '@/common/type'
import config from '@/config'

export const genXML = (urls: SitemapItem[]) => {
  const base: ElementCompact = {
    _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
    urlset: {
      _attributes: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
      url: urls.map(e => {
        const ret: any = {
          loc: {
            _text: e.loc.replace(/(?<=\/):[a-zA-Z]+?(?=(\/|$))/, '0')
          }
        }
        if (e.lastmod)
          ret.lastmod = {
            _text: e.lastmod.toISOString().slice(0, 10)
          }
        if (e.changefreq)
          ret.changefreq = {
            _text: e.changefreq
          }
        if (e.priority)
          ret.priority = {
            _text: e.priority
          }
        return ret
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
        changefreq: e.about?.changefreq,
        lastmod: new Date(), // TODO: use lastmod in metadata
        priority: 0.4
      }
    })
  ]
  ctx.respondWith(
    new Response(genXML(urls), {
      headers: {
        'Content-type': 'application/xml; charset="utf-8"'
      }
    })
  )
}
