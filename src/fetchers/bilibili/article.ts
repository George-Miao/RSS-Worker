import RSSFeed from '@/app/rss/feed'
import { FetchNotFoundError } from '@/common/error'
import { reqMultiple } from '@/common/req'
import { defineRoute, Req, genFeedLinks } from '@/common/toolkit'
import { ArticleAPI } from './type'

export default defineRoute({
  path: '/bili/article/:mid',
  schema: {
    params: {
      properties: {
        mid: {
          pattern: '^\\d+$'
        }
      }
    },
    search: {
      properties: {
        perPage: {
          pattern: '^[1-9][0-9]*$'
        },
        content: {
          pattern: '^(0|1)$'
        }
      }
    }
  },
  async fetch(ctx, { mid }) {
    const search = ctx.req.url.searchParams
    const data = await Req.get(
      `https://api.bilibili.com/x/space/article?mid=${mid}&ps=${
        search.get('perPage') ?? '10'
      }`
    )
      .json<ArticleAPI>()
      .then(e => {
        if (!e?.data?.articles?.length)
          throw new FetchNotFoundError(`No content found with mid ${mid}`)
        return e.data.articles
      })
    const user = data[1].author
    console.log(JSON.stringify(user))
    const feed = new RSSFeed({
      ...genFeedLinks(ctx),
      title: `Bilibili用户"${user.name}"的更新`,
      description: `Bilibili用户"${user.name}"的更新`,
      author: {
        name: user.name,
        link: `https://space.bilibili.com/${mid}`
      }
    })
    if (search.get('content') != '0') {
      const contentPattern = /<div class="article-holder">(.*?)<\/div>/g
      const [fullfilled, rejected] = await reqMultiple(
        data.map(e => {
          return {
            meta: e,
            fn: async url =>
              Req.get(url)
                .text()
                .then(e =>
                  e
                    .match(contentPattern)?.[0]
                    ?.replace('data-src="//', 'src="https://')
                ),
            url: `https://www.bilibili.com/read/cv${e.id}`
          }
        })
      )
      console.log(
        fullfilled,
        (rejected as Error[]).map(e => e.message)
      )

      fullfilled.forEach(e => {
        feed.addItem({
          link: e.url,
          content: e.data,
          description: e.meta.summary,
          image: {
            url: e.meta.image_urls[0]
          },
          date: new Date(e.meta.publish_time * 1000),
          title: e.meta.title
        })
      })
    }
    return feed
  }
})
