import { RSSFeedOptions, NumStr, Changefreq, RSSFormat } from '@/common/type'

export interface Config {
  /**
   * @description: Base dir of rss source.
   * @todo
   * @example in https://rss.miao.dev/Src/Endpoint, `https://rss.miao.dev` will be the basePath
   */
  basePath: string
  /**
   * @description: Global feed options.
   *  It applies to every `Feed` object, and will be overwritten by options passed in during initializing.
   */
  feed?: Partial<RSSFeedOptions> & {
    /**
     * @description Default format when user does not specify using '/endpoint.format' or `f` / `format` flag
     * @enum RSSFormat
     * @default RSSFormat.Atom
     */
    defaultFormat?: RSSFormat
  }
  /**
   * @description User Agent used while accessing various resources.
   *  Can be overwritten while invoking `Req` or `fetch` with RequestInit
   */
  userAgent: string
  /**
   * @description Environment
   */
  env: string
  /**
   * @description: Cache options.
   */
  cache?: {
    /**
     * @description Whether to use cached content and save content to cache
     * @default false
     */
    noCache?: boolean
    /**
     * @description Seconds to expire. Can be overwritten by routes.
     * @default 3600 (1 hour)
     */
    expirationTTL?: NumStr
    /**
     * @description Timestamp when the cache will expire. Can be overwritten by routes.
     * @default Date.now()+3600 (1 hour since now)
     */
    expiration?: NumStr
  }
  /**
   * @description New Relic integration.
   */
  newrelic?: {
    /**
     * @description Enable log to newrelic
     */
    enabled: boolean
    /**
     * @description License key for New Relic APIs.
     */
    licenseKey: string
  }
  /**
   * @description Http fetcher.
   * @default fetch provided in worker
   */
  fetch?: typeof fetch
}

const config: Config = {
  basePath: BASE,
  feed: {
    generator: BASE,
    copyright: BASE,
    defaultFormat: RSSFormat.RSS
  },
  env: ENV,
  cache: { expirationTTL: 60 * 60 },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4453.0 Safari/537.36',
  newrelic: {
    enabled: false,
    licenseKey: NEWRELIC_LICENSE_KEY
  },
  fetch: fetch
}

export default config
