import config from '@/config'
import { Route, RSSType } from '@/common/type'
import { Context, Middleware } from '@cfworker/web'
import RSSFeed from './feed'
import { log } from '@/common/toolkit'

export const getFeed = async (route: Route, ctx: Context) => {
  const pathname = ctx.req.url.pathname
  const rssType = getRSSType(ctx) ?? RSSType.ATOM
  const key = `${rssType}@${pathname}`

  let feed: RSSFeed

  const cacheContent = async (feed: RSSFeed) => {
    await FEED.put(key, JSON.stringify(feed.serialize()), {
      expirationTtl:
        route.init?.expirationTTL ?? config.cache?.expirationTTL ?? 60 * 60,
      expiration: route.init?.expiration ?? config.cache?.expiration ?? 60 * 60
    })
    console.log(`Content ${key} has been cached into KV`)
  }

  if (!config.cache?.noCache && ENV !== 'dev') {
    const contentInKVStr = (await FEED.get(key)) ?? undefined
    if (contentInKVStr) {
      const contentInKV = JSON.parse(contentInKVStr, (k, v) => {
        if (typeof k !== 'string') return v
        if (
          /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.test(
            v
          )
        )
          return new Date(v)
        return v
      })
      console.log('Found cached content: ', contentInKV)
      feed = new RSSFeed({ base: contentInKV })
    } else {
      console.log(
        "Cache is enabled, however there's no cached content found, fetching"
      )
      feed = await route.fetch(ctx)
      console.log('Fetcher returned')
      if (ENV !== 'dev' && !config.cache?.noCache) await cacheContent(feed)
    }
  } else {
    console.log('Cache has been disabled, fetching')
    feed = await route.fetch(ctx)
    console.log('Fetcher returned')
  }
  return feed
}

export const getContent = (feed: RSSFeed, rssType?: RSSType | null): string => {
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

export const getRSSType = (ctx: Context) =>
  ctx.req.url.searchParams.get('type') as RSSType | null

export const getContentType = (rssType: RSSType) => {
  return {
    atom: 'application/xml; charset=utf-8',
    rss: 'application/xml; charset=utf-8',
    json: 'application/json; charset=utf-8'
  }[rssType]
}

export const logMiddleware: Middleware = async (ctx, next) => {
  log(`Income request for ${ctx.req.url.pathname}`)
  await next()
  log(
    `Handled request for ${ctx.req.url.pathname}. Status: [${
      ctx.res.status
    }] ${JSON.stringify(ctx.res.body)}`
  )
}

export const RSSRouteMiddlewareFactory: (
  route: Route
) => Middleware = route => async ctx => {
  const rssType = getRSSType(ctx) ?? RSSType.ATOM
  const feed = await getFeed(route, ctx)
  ctx.respondWith(
    new Response(getContent(feed, rssType), {
      headers: {
        'Content-Type': getContentType(rssType)
      }
    })
  )
}
