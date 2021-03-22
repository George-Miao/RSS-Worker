import { RSSFeedOptions, NumStr } from '@/type'

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
  feed?: Partial<RSSFeedOptions>
  /**
   * @description User Agent used while accessing various resources.
   *  Can be overwritten while invoking `get` method with RequestInit
   */
  userAgent: string
  /**
   * @description: Cache options.
   */
  cache?: {
    /**
     * @description Whether to use cached content and save content to cache
     */
    noCache?: boolean
    /**
     * @description Seconds to expire. Can be overwritten by routes.
     */
    expirationTTL?: NumStr
    /**
     * @description Timestamp when the cache will expire. Can be overwritten by routes.
     */
    expiration?: NumStr
  }
  /**
   * @description New Relic integration.
   */
  newrelic?: {
    /**
     * @description License key for New Relic APIs.
     */
    licenseKey: string
  }
}

const config: Config = {
  basePath: BASE,
  feed: {
    generator: BASE,
    copyright: BASE,
  },
  cache: { expirationTTL: 60 * 60 },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4453.0 Safari/537.36',
  newrelic: {
    licenseKey: NEWRELIC_LICENSE_KEY,
  },
}

export default config
