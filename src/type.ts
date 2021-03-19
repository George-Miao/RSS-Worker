import { Feed as RawFeed, FeedOptions as RawFeedOptions } from 'feed'
import { Context, RequestSchemas } from '@cfworker/web'
import Feed from './feed/feed'

export type FnKeys<T> = {
  [P in keyof T]: T[P] extends Function ? P : never
}[keyof T]

export type OmitFn<T> = Omit<T, FnKeys<T>>

export type Fetcher = (ctx: Context) => Feed

// Route = [RequestedPath, FetcherPath, RequestSchema?]
export type Route = [
  string,
  () => Promise<{ default: Fetcher }>,
  RequestSchemas?,
]

// Will be used in KV storage
export type SerializedFeed = OmitFn<RawFeed>

export interface FeedOptions extends Partial<RawFeedOptions> {
  title: string
}

export enum RSSType {
  RSS = 'rss',
  ATOM = 'atom',
  JSON = 'json',
}
