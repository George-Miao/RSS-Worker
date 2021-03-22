import { Feed as RawFeed, FeedOptions } from 'feed'

import { SerializedFeed, FeedInit } from '@/type'
import config from '@/config'

export default class RSSFeed extends RawFeed {
  // Option priority: content(serialized data) > option passed in > base option
  constructor(init: FeedInit) {
    init.option = init.option ?? {}
    const id =
        init.base?.options.id ??
        init.base?.options.link ??
        init.option.link ??
        BASE ??
        'https://rss.miao.dev/',
      copyright =
        init.base?.options.copyright ??
        init.option.copyright ??
        BASE ??
        'https://rss.miao.dev/'
    if (init.base) {
      super({ ...config.feed, ...init.option, ...init.base.options })
      Object.assign(this, init.base)
    } else {
      super({ ...config.feed, ...init.option, id, copyright } as FeedOptions)
    }
  }

  public serialize(): SerializedFeed {
    return {
      categories: this.categories,
      options: this.options,
      contributors: this.contributors,
      extensions: this.extensions,
      items: this.items,
    }
  }
}
