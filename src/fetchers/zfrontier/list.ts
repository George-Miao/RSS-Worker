import RSSFeed from '@/app/feed'
import Req from '@/common/req'
import {
  defineRoute,
  genFeedLinks,
  FetchError,
  formatURL
} from '@/common/toolkit'
import { Item } from 'feed'
import { basePath, checkAPI as checkZfrontierAPI, reqInit } from './common'
import { ZfrontierTagFlow, ZfrontierPostContent, TagFlow } from './type'

export default defineRoute({
  path: '/zfrontier/list/:tagId',
  schema: {
    params: {
      required: ['tagId']
    },
    search: {
      properties: {
        page: {
          pattern: '^[1-9][0-9]*$'
        }
      }
    }
  },
  async fetch(ctx) {
    const { tagId } = ctx.req.params
    const page = ctx.req.url.searchParams.get('page') ?? '1'

    const replaceGroup = /src=\"\/\//g

    const data = await Req.post(`${basePath}/v2/home/flow/list`)
      .with(reqInit)
      .load(() => {
        const form = new FormData()
        form.append('page', page)
        form.append('tagIds[0]', tagId)
        return form
      })
      .json<ZfrontierTagFlow>()
      .then(e => {
        checkZfrontierAPI(e)
        const list = e.data.list
        if (list.length == 0) {
          throw new FetchError(
            `Cannot find tag id ${tagId} or the API does not return any content`
          )
        }
        return list as TagFlow[]
      })

    const feed = new RSSFeed({
      option: {
        ...genFeedLinks(ctx),
        title: `Zfrontier #${tagId.toUpperCase()}`,
        description: `Zfrontier #${tagId.toUpperCase()} 下的更新`
      }
    })

    const contentReqs: Promise<Item>[] = []

    for (const e of data) {
      contentReqs.push(
        Req.post(`${basePath}/api/circle/flow/${e.view_url.split('/').pop()}`)
          .with(reqInit)
          .json<ZfrontierPostContent>()
          .then(checkZfrontierAPI)
          .then(e => e.data.flow)
          .then(e => {
            return {
              title: e.title,
              date: new Date(e.created_at),
              link: basePath + e.view_url,
              description: e.text,
              image: e.imgs[0]
                ? {
                    url: formatURL(e.imgs[0]),
                    type: 'image/jpeg'
                  }
                : undefined,
              content: e.item?.article?.content?.replaceAll(
                replaceGroup,
                'src="https://'
              )
            }
          })
        // .then(e => e.data)
      )
    }

    await Promise.all(contentReqs).then(e => {
      e.forEach(feed.addItem)
    })

    return feed
  }
})
