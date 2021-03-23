import { Context } from '@cfworker/web'
import config from '@/config'
import { RSSFeedOptions, Route } from '@/common/type'
import { Feed } from 'feed'

export class FetchError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'FetchError'
  }
}

export class NotFoundFetchError extends FetchError {
  constructor(message?: string) {
    super(message)
    this.name = 'NotFoundFetchError'
  }
}

export const formatURL = (url: string, base?: string | URL) => {
  try {
    url = decodeURI(url)
    if (typeof base === 'string') base = decodeURI(base)
    if (/^\/\//.test(url)) url = 'https:' + url
    const newUrl = new URL(url, base)
    newUrl.protocol = 'https'
    return newUrl.toString()
  } catch (e) {
    console.log(url.toString())
    throw new Error(`Error formatting url: ${e}`)
  }
}

export const log = (msg: string, others?: Record<string, string>) => {
  console.log(msg)
  if (!config.newrelic) return
  fetch('https://log-api.newrelic.com/log/v1', {
    headers: {
      'X-License-Key': config.newrelic.licenseKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...others,
      message: msg,
      timestamp: +new Date() / 1000,
      logtype: 'RSS',
    }),
    method: 'POST',
  })
    .then(async e => {
      console.log(
        e.status >= 200 && e.status < 300
          ? 'Done logging'
          : `Http error <${e.status}>[${await e.text()}] @ logging ${msg}`,
      )
    })
    .catch(e => console.log(`Internal error ${e} @ logging ${msg}`))
}

export const genFeedLinks = (ctx: Context) => {
  const baseURL = new URL(ctx.req.url.pathname, config.basePath)
  baseURL.searchParams.set(
    'type',
    ctx.req.url.searchParams.get('type') ?? 'atom',
  )
  const strLink = baseURL.toString()
  console.log(strLink)
  return {
    feed: strLink,
    link: strLink,
  }
}

export const genRandomStr = () => Math.random().toString(36).slice(2)

export const define = <T>(x: T) => x

export const defineRoute = (route: Route) => route

export const defineRoutes = (routes: Route[]) => routes
