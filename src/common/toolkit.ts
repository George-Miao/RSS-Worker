import { Context } from '@cfworker/web'

import config from '@/config'
import { Route } from './type'
import Req from './req'

export const formatURL = (url: string, base?: string | URL) => {
  try {
    url = decodeURI(url)
    if (typeof base === 'string') base = decodeURI(base)
    if (/^\/\//.test(url)) url = 'https:' + url
    console.log(url)
    const newUrl = new URL(url, base)
    newUrl.protocol = 'https'
    return newUrl.toString()
  } catch (e) {
    console.error(`Error formatting url ${e}`, url.toString(), base?.toString())
    return url.toString()
  }
}

export const log = (
  msg: string,
  newrelic = true,
  others?: Record<string, string>
) => {
  console.log(msg)
  if (newrelic && config.newrelic?.enabled)
    fetch('https://log-api.newrelic.com/log/v1', {
      headers: {
        'X-License-Key': config.newrelic.licenseKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...others,
        message: msg,
        timestamp: +new Date() / 1000,
        logtype: 'RSS'
      }),
      method: 'POST'
    })
      .then(async e => {
        console.log(
          e.status >= 200 && e.status < 300
            ? 'Done logging'
            : `Http error <${e.status}>[${await e.text()}] @ logging ${msg}`
        )
      })
      .catch(e => console.log(`Internal error ${e} @ logging ${msg}`))
  return msg
}

export const genFeedLinks = (ctx: Context) => {
  const baseURL = new URL(ctx.req.url.pathname, config.basePath)
  const strLink = baseURL.toString()
  console.log(strLink)
  return {
    feed: strLink,
    link: strLink
  }
}

export const genRandomStr = () => Math.random().toString(36).slice(2)

export const define = <T>(x: T) => x

export const defineRoute = <Path extends string>(route: Route<Path>) => route

export const defineRoutes = (routes: Route[]) => routes

export { Req }
