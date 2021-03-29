import { formatURL, Req } from '@/common/toolkit'
import { FetchNotFoundError } from '@/common/error'
import { Item } from 'feed'
import { ZfrontierAPI, ZfrontierPostContent } from './type'

export const reqInit = {
  headers: {
    'X-CSRF-TOKEN': '1616007892f453cdd0eb3134a59ed867faa7d82a'
  }
}
export const basePath = 'https://www.zfrontier.com'

export const checkAPI = <Data = any>(data: ZfrontierAPI<Data>) => {
  if (data.ok != 0)
    throw new FetchNotFoundError(
      `Error: Zfrontier API returns "${data.ok}" instead of "0" as ok. Message: "${data.msg}"`
    )
  return data
}

export const fetchContents = async (urls: string[]) => {
  const contentReqs: Promise<Item>[] = []

  for (const e of urls) {
    contentReqs.push(
      Req.post(`${basePath}/api/circle/flow/${e}`)
        .with(reqInit)
        .json<ZfrontierPostContent>()
        .then(checkAPI)
        .then(e => e.data.flow)
        .then(e => {
          return {
            title: e.title,
            date: new Date(e.created_at),
            published: new Date(e.created_at),
            link: basePath + e.view_url,
            description: e.text,
            image: e.imgs[0]
              ? {
                  url: formatURL(e.imgs[0]),
                  type: 'image/jpeg'
                }
              : undefined,
            content: e.item?.article?.content?.replaceAll(
              /src=\"\/\//g,
              'src="https://'
            )
          }
        })
      // .then(e => e.data)
    )
  }

  return await Promise.all(contentReqs)
}
