import { Author } from 'feed'

import RSSFeed from '@/app/rss/feed'
import { FetchNotFoundError } from '@/common/error'
import { defineRoute, formatURL, genFeedLinks } from '@/common/toolkit'
import Req from '@/common/req'

import { ZfrontierUserFlow } from './type'
import { basePath, checkAPI, fetchContents, reqInit } from './common'

export default defineRoute({
  path: '/zfrontier/user/:userId',
  schema: {
    params: {
      required: ['userId'],
      properties: {
        userId: {
          pattern: '^\\d*$'
        }
      }
    },
    search: {
      properties: {
        page: {
          pattern: '^[1-9][0-9]*$'
        }
      }
    }
  },
  async fetch(ctx, { userId }) {
    const page = ctx.req.url.searchParams.get('page') ?? '1'

    const feedLinks = genFeedLinks(ctx)
    const reqForm = new FormData()

    reqForm.append('page', page)
    reqForm.append('uid', userId)

    const data = await Req.post('https://www.zfrontier.com/v2/user/flow')
      .with(reqInit)
      .load(reqForm)
      .json<ZfrontierUserFlow>()
      .then(e => {
        checkAPI(e)
        const list = e.data.list
        if (list.length == 0)
          throw new FetchNotFoundError(
            `Cannot find user id ${userId} or there's no content posted by this user`
          )
        return list
      })

    const user = data[0].user

    const author: Author = {
      name: user.nickname,
      link: formatURL(user.view_url, basePath)
    }

    const feed = new RSSFeed({
      ...feedLinks,
      title: `Zfrontier用户"${user.nickname}"的更新`,
      description: `Zfrontier用户"${user.nickname}"的更新`,
      favicon: formatURL(user.avatar_path),
      image: formatURL(data[0].masonry_cover.src),
      author
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
