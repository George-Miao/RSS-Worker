import { Middleware, Router, validate } from '@cfworker/web'

import routes from '@/routes'

import { getRSSRouteMiddleware } from '@/app/RSSRoute'

const router = new Router().get('/', ctx =>
  ctx.respondWith(new Response('RSS Index')),
)

routes.forEach(route => {
  const middlewares: Middleware[] = []
  console.log(`Initializing GET middleware for ${route.path}`)
  if (route.schema) middlewares.push(validate(route.schema))
  middlewares.push(getRSSRouteMiddleware(route))
  router.get(route.path, ...middlewares)
})

export default router
