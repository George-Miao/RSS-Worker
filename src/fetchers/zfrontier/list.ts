import RSSFeed from '@/app/feed'
import Req from '@/common/req'
import { defineRoute, genFeedLinks } from '@/common/toolkit'
import { TagFlow } from './type'

export default defineRoute({
  path: '/zfrontier/list/:tagId',
  schema: {
    params: {
      required: ['tagId'],
      properties: {
        tagId: {
          enum: ['info'],
        },
      },
    },
    search: {
      properties: {
        page: {
          pattern: '^[1-9][0-9]*$',
        },
      },
    },
  },
  async fetch(ctx) {
    const { tagId } = ctx.req.params
    const page = ctx.req.url.searchParams.get('page') ?? '1'

    const data = await Req.post('https://www.zfrontier.com/v2/home/flow/list')
      .set('headers', {
        'X-CSRF-TOKEN': '1616007892f453cdd0eb3134a59ed867faa7d82a',
      })
      .load(() => {
        const form = new FormData()
        form.append('page', page)
        form.append('tagIds[0]', tagId)
        return form
      })
      .json<TagFlow>()
      .then(e => JSON.stringify(e))

    console.log(data)

    const feed = new RSSFeed({
      option: { ...genFeedLinks(ctx), title: `Zfrontier ${tagId}` },
    })
    return feed
  },
})
