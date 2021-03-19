import { HttpError, Middleware, Router, validate } from '@cfworker/web'

import { Fetcher, Route, RSSType, SerializedFeed } from '@/type'
import Feed from '@/feed/feed'
import routes from '@/routes'
import config from '@/config'

const getContent = (feed: Feed, rssType?: RSSType | undefined): string => {
  console.log(`rssType = ${rssType}`)
  switch (rssType) {
    case RSSType.JSON:
      return feed.json1()
    case RSSType.RSS:
      return feed.rss2()
    case RSSType.ATOM:
      return feed.atom1()
    default:
      return feed.atom1()
  }
}

const RSSRouteFactory: (route: Route) => Middleware = route => async ctx => {
  // rssType has been checked by validate middleware. It is one of [json, atom, rss] now.
  let rssType =
    (ctx.req.url.searchParams.get('type') as RSSType) || RSSType.ATOM
  const pathname = ctx.req.url.pathname
  const key = `${pathname}@${rssType}`

  console.log(`GET ${pathname} matched ${route[0]}`)

  let feed: Feed

  const contentInKV = await FEED.get<SerializedFeed>(key, 'json')
  if (contentInKV) {
    console.log('Found cached content')
    feed = new Feed({ title: 'test_test' }, contentInKV)
  } else {
    console.log('No cached content, fetching')
    feed = await route[1]().then(e => e(ctx))
    if (!(ENV === 'dev') || config.alwaysCache) {
      console.log(`Content ${key} has been cached into KV`)
      await FEED.put(key, JSON.stringify(feed.serialize()), {
        expirationTtl: 100,
      })
    }
    if (!(feed instanceof Feed)) {
      let errMsg = ''
      if (ENV === 'dev') {
        errMsg = `Fetcher should return instance of Feed. ${typeof feed} is returned instead.`
      } else if (ENV === 'production') {
        errMsg = 'Internal error'
      }
      throw new HttpError(
        500,
        errMsg + `\n${route[0]} => src/fetchers/${route[1]}`,
      )
    }
  }
  ctx.respondWith(new Response(getContent(feed, rssType)))
}

const router = new Router().get('/', ctx => {
  ctx.respondWith(new Response('Index'))
})

routes.forEach(route => {
  const mwList: Middleware[] = []
  if (route[2]) mwList.push(validate(route[2]))
  mwList.push(RSSRouteFactory(route))
  router.get(route[0], ...mwList)
})

export default router
