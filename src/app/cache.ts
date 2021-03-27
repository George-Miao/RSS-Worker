import { Route } from '@/common/type'
import config from '@/config'
import RSSFeed from './feed'

export const cacheContent = async (
  route: Route,
  key: string,
  feed: RSSFeed
) => {
  await FEED.put(key, JSON.stringify(feed.serialize()), {
    expirationTtl:
      route.init?.expirationTTL ?? config.cache?.expirationTTL ?? 60 * 60,
    expiration:
      route.init?.expiration ?? config.cache?.expiration ?? Date.now() + 60 * 60
  })
  console.log(`[${key}] has been cached into KV`)
}
