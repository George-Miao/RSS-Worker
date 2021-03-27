import { Metadata, Route } from '@/common/type'
import routes from '@/routes'

const update = async (metadatas: Metadata[]): Promise<any> => {}

export default async () => {
  let meta = await FEED.get<Record<string, Metadata>>('@metadata', 'json')
  if (!meta) meta = {}
  const tasks: Promise<any>[] = []
  routes.forEach(route => {})
  await FEED.put('@metadata', JSON.stringify(meta))
}
