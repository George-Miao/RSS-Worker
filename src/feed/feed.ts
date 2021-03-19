import { Feed as RawFeed, FeedOptions as RawFeedOptions } from 'feed'

import { FeedOptions, SerializedFeed } from '@/type'
import config from '@/config'

export default class Feed extends RawFeed {
  // Option priority: content(serialized data) > option passed in > base option
  constructor(option: FeedOptions, content?: SerializedFeed) {
    if (config.baseFeedOptions)
      option = Object.assign(config.baseFeedOptions, option)
    if (content) Object.assign(option, content.options)
    if (!option.id) option.id = option.link ?? option.title
    super(option as RawFeedOptions)
    if (content) {
      Object.assign(this, content)
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
