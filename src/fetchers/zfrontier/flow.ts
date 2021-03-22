import { Author } from 'feed'

import RSSFeed from '@/app/feed'
import {
  defineRoute,
  FetchError,
  fetchJSON,
  formatURL,
  genFeedLinks,
} from '@/toolkit'
import { ZfrontierUserFlow } from './type'
import { HttpError } from '@cfworker/web'

export default defineRoute({
  path: '/zfrontier/user/:userId',
  schema: {
    params: {
      required: ['userId'],
      properties: {
        userId: {
          pattern: '^\\d*$',
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
    const { userId } = ctx.req.params
    const page = ctx.req.url.searchParams.get('page') ?? '1'

    const basePath = 'https://www.zfrontier.com'

    const feedLinks = genFeedLinks(ctx)
    const reqForm = new FormData()

    reqForm.append('page', page)
    reqForm.append('uid', userId)

    const data = await fetchJSON<ZfrontierUserFlow>(
      'https://www.zfrontier.com/v2/user/flow',
      {
        headers: {
          'X-CSRF-TOKEN': '1616007892f453cdd0eb3134a59ed867faa7d82a',
        },
        method: 'POST',
        body: reqForm,
      },
    ).then(e => {
      if (e.data.ok != 0)
        throw new FetchError(
          `Error: Zfrontier API returns "${e.data.ok}" instead of "0" as ok. Message: "${e.data.msg}"`,
        )
      const list = e.data.data.list
      if (list.length == 0)
        throw new HttpError(404, `Cannot find user id ${userId}`)
      return list
    })

    const user = data[0].user

    const author: Author = {
      name: user.nickname,
      link: formatURL(user.view_url, basePath),
    }

    const feed = new RSSFeed({
      option: {
        ...feedLinks,
        title: `Zfrontier用户"${user.nickname}"的更新`,
        description: `Zfrontier用户"${user.nickname}"的更新`,
        favicon: formatURL(user.avatar_path),
        image: formatURL(data[0].masonry_cover.src),
        author,
      },
    })

    data.forEach(e => {
      const image = e.masonry_cover
        ? {
            url: formatURL(e.masonry_cover?.src),
            type: 'image/' + e.masonry_cover?.f,
            length: e.masonry_cover?.h,
          }
        : undefined

      return feed.addItem({
        date: new Date(e.created_at),
        link: formatURL(e.view_url, basePath),
        title: e.title,
        description: e.text,
        author: [author],
        image,
      })
    })

    return feed
  },
})
