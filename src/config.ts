import { FeedOptions } from 'feed'

export interface Config {
  baseFeedOptions: Partial<FeedOptions>
  baseRoot: string
  alwaysCache?: boolean
}

const config: Config = {
  baseRoot: 'https://rss.miao.dev',
  baseFeedOptions: {
    generator: 'https://rss.miao.dev',
    copyright: 'https://rss.miao.dev',
  },
  alwaysCache: true,
}

export default config
