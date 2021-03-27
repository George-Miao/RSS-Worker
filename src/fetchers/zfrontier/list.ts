import RSSFeed from '@/app/feed'
import Req from '@/common/req'
import { defineRoute, genFeedLinks } from '@/common/toolkit'
import { FetchNotFoundError } from '@/common/error'
import { basePath, checkAPI, fetchContents, reqInit } from './common'
import { ZfrontierTagFlow, TagFlow } from './type'

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
        checkAPI(e)
        const list = e.data.list
        if (list.length == 0) {
          throw new FetchNotFoundError(
            `Cannot find tag id ${tagId} or the API does not return any content`
          )
        }
        return list as TagFlow[]
      })

    const feed = new RSSFeed({
      ...genFeedLinks(ctx),
      title: `Zfrontier #${tagId.toUpperCase()}`,
      description: `Zfrontier #${tagId.toUpperCase()} 下的更新`
    })
    const urls: string[] = []
    data.forEach(e => {
      const url = e.view_url.split('/').pop()
      if (url) urls.push(url)
    })
    await fetchContents(urls).then(e => e.forEach(x => feed.addItem(x)))
    return feed
  }
})
