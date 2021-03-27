import { FetchError } from '@/common/toolkit'
import { ZfrontierAPI } from './type'

export const reqInit = {
  headers: {
    'X-CSRF-TOKEN': '1616007892f453cdd0eb3134a59ed867faa7d82a',
  },
}
export const basePath = 'https://www.zfrontier.com'

export const checkAPI = <Data = any>(data: ZfrontierAPI<Data>) => {
  if (data.ok != 0)
    throw new FetchError(
      `Error: Zfrontier API returns "${data.ok}" instead of "0" as ok. Message: "${data.msg}"`,
    )
  return data
}
