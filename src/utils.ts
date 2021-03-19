import { Context } from '@cfworker/web'
import config from './config'
import { Fetcher } from './type'

export const genFeedLinks = (ctx: Context) => {
  const baseFeed = config.baseRoot + ctx.req.url.pathname
  return {
    feed: ctx.req.url.searchParams.get('type'),
  }
}

export const genRandomStr = () => Math.random().toString(36).slice(2)
