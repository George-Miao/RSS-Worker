import { Context, Middleware } from '@cfworker/web'

import { Route, RSSFormat } from '@/common/type'
import {
  FetchInternalError,
  FetchNotFoundError,
  FetchSourceError
} from '@/common/error'
import { cacheContent } from '../cache'
import config from '@/config'
import RSSFeed from './feed'
import { log } from '@/common/toolkit'

export const getFeed = async (route: Route, ctx: Context) => {
  const pathname = ctx.req.url.pathname

  let feed: RSSFeed

  // Under two condition cache will be disabled:
  // 1. config.noCache == true
  // 2. ENV == 'dev'
  // Set ENV using `wrangler -e :env`
  if (!config.cache?.noCache && config.env !== 'dev') {
    const contentInKVStr = await FEED.get(pathname)
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
      console.log('Cache hit')
      feed = new RSSFeed(undefined, contentInKV)
    } else {
      console.log('Cache is enabled but failed to hit, fetching')
      feed = await route.fetch(ctx, ctx.req.params)
      console.log('Fetcher returned')
      await cacheContent(route, pathname, feed)
    }
  } else {
    console.log('Cache is disabled, fetching')
    feed = await route.fetch(ctx, ctx.req.params)
    console.log('Fetcher returned')
  }
  return feed
}

export const getContentType = (rssFormat: RSSFormat) => {
  return {
    atom: 'application/xml; charset=utf-8',
    rss: 'application/xml; charset=utf-8',
    json: 'application/json; charset=utf-8'
  }[rssFormat]
}

export const logMiddleware: Middleware = async (ctx, next) => {
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
  log(`Matched route: ${route.path}. Responding.`)
  try {
    const feed = await getFeed(route, ctx)
    ctx.respondWith(
      new Response(feed.content(ctx.state.rssFormat), {
        headers: {
          'Content-Type': getContentType(ctx.state.rssFormat),
          'Referrer-Policy': 'no-referrer'
        }
      })
    )
  } catch (e) {
    let resp: Response

    if (e instanceof FetchInternalError)
      resp = new Response(
        config.env === 'dev' ? e.message + e.stack : e.message,
        {
          status: 500,
          statusText: 'Internal Error'
        }
      )
    else if (e instanceof FetchNotFoundError)
      resp = new Response(
        config.env === 'dev' ? e.message + e.stack : e.message,
        {
          status: 404,
          statusText: 'Not Found'
        }
      )
    else if (e instanceof FetchSourceError)
      resp = new Response(
        config.env === 'dev' ? e.message + e.stack : e.message,
        {
          status: 404,
          statusText: 'Fetch Source Error'
        }
      )
    else
      resp = new Response(
        config.env === 'dev' ? e.message + e.stack : 'Internal Error',
        {
          status: 500,
          statusText: e.message
        }
      )
    ctx.respondWith(resp)
  }
}
