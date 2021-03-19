import Feed from '@/feed/feed'
import { Fetcher } from '@/type'
import { genFeedLinks, genRandomStr } from '@/utils'

const fetcher: Fetcher = ctx => {
  const feedLinks = genFeedLinks(ctx)
  const feed = new Feed({
    ...feedLinks,
    title: 'zfrontier user',
    description: 'test',
    feed: 'rss.miao.dev',
  })
  feed.addItem({
    date: new Date(),
    link: `https://example.com/${genRandomStr()}`,
    title: genRandomStr(),
    author: [{ name: genRandomStr() }],
  })
  feed.addItem({
    date: new Date(),
    link: `https://example.com/${genRandomStr()}`,
    title: genRandomStr(),
    author: [{ name: genRandomStr() }],
    id: ctx.req.url.pathname,
  })
  return feed
}

export default fetcher
