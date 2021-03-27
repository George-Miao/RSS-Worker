import { Middleware, Router, validate } from '@cfworker/web'

import routes from '@/routes'

import { logMiddleware, RSSRouteMiddlewareFactory } from '@/app/RSSRoute'
import { sitemapMiddlewareFactory } from './sitemap'

const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://rss.miao.dev/sitemap.xml`

const router = new Router()
  .get('/', ctx => ctx.respondWith(new Response('RSS Index')))
  .get('/robots.txt', ctx => ctx.respondWith(new Response(robotsTxt)))
  .get('/sitemap.xml', sitemapMiddlewareFactory(routes))

routes.forEach(route => {
  const middlewares: Middleware[] = []
  console.log(`Initializing GET middleware for ${route.path}`)
  middlewares.push(logMiddleware)
  if (route.schema) {
    middlewares.push(validate(route.schema))
  }
  middlewares.push(RSSRouteMiddlewareFactory(route))
  router.get(route.path, ...middlewares)
  console.log(`Done initializing GET middleware for ${route.path}`)
})

export default router
