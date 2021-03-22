import { Feed as RawFeed, FeedOptions as RawFeedOptions } from 'feed'
import { Context, RequestSchemas } from '@cfworker/web'
import RSSFeed from './app/feed'

export type NumStr = string | number

export type PickType<T, Picked> = {
  [P in keyof T]: T[P] extends Picked ? P : never
}[keyof T]

export type FnKeys<T> = PickType<T, Function>

export type OmitFn<T> = Omit<T, FnKeys<T>>

/**
 * @description Function used to fetch contents from various source
 */
export type Fetcher = (ctx: Context) => RSSFeed | PromiseLike<RSSFeed>

export interface Route {
  path: string
  fetch: Fetcher
  schema?: RequestSchemas
  init?: RouteInit
}

export interface RouteInit {
  expirationTTL?: NumStr
  expiration?: NumStr
}

// Will be used in KV storage
export type SerializedFeed = OmitFn<RawFeed>

export type FeedInit =
  | {
      base?: SerializedFeed
      option: RSSFeedOptions
    }
  | {
      base: SerializedFeed
      option?: Partial<RSSFeedOptions>
    }

export interface RSSFeedOptions extends Partial<RawFeedOptions> {
  link: string
  title: string
}

export enum RSSType {
  RSS = 'rss',
  ATOM = 'atom',
  JSON = 'json',
}

export enum CachePolicy {}
