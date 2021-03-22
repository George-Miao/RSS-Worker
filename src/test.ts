import { log } from '@/toolkit'

export default async (e: FetchEvent) => {
  ;[1919, 810].map(n => log(`Test log number ${n}`))
  return new Response('Done testing')
}
