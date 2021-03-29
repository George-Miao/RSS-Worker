import { Feed as RawFeed, FeedOptions } from 'feed'

import {
  SerializedFeed,
  FeedInit,
  RSSFormat,
  RSSFeedOptions
} from '@/common/type'
import config from '@/config'

export default class RSSFeed extends RawFeed {
  // Option priority: content(serialized data) > option passed in > base option
  constructor(option?: RSSFeedOptions, base?: SerializedFeed) {
    if (base) {
      super({ ...config.feed, ...base.options, ...option })
      Object.assign(this, base)
    } else {
      const id = option?.link ?? config.basePath
      const copyright = option?.copyright ?? config.basePath
      super({ ...config.feed, ...option, id, copyright } as FeedOptions)
    }
  }

  public serialize(): SerializedFeed {
    return {
      categories: this.categories,
      options: this.options,
      contributors: this.contributors,
      extensions: this.extensions,
      items: this.items
    }
  }

  public content(type: RSSFormat) {
    switch (type) {
      case RSSFormat.JSON:
        return this.json1()
      case RSSFormat.RSS:
        return this.rss2()
      case RSSFormat.ATOM:
        return this.atom1()
      default:
        return this.atom1()
    }
  }
}
