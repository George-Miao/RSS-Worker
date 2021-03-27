import { Feed as RawFeed, FeedOptions as RawFeedOptions } from 'feed'
import { Context, RequestSchemas } from '@cfworker/web'

import RSSFeed from '@/app/feed'

export type NumStr = string | number

export type PickType<T, Picked> = {
  [P in keyof T]: T[P] extends Picked ? P : never
}[keyof T]

export type FnKeys<T> = PickType<T, Function>

export type OmitFn<T> = Omit<T, FnKeys<T>>

/**
 * @description Function used to fetch contents from various source
 */
export type Fetcher<Path extends string> = (
  ctx: Context,
  params: ParamType<Path>
) => RSSFeed | Promise<RSSFeed>

/**
 * @example /test/:foo/test2/:bar => { foo: string, bar: string }
 */
export type ParamType<
  T extends string,
  Params extends Record<string, string> = {}
> = T extends `:${infer P}/${infer R}`
  ? ParamType<R, { [K in P | keyof Params]: string }>
  : T extends `${string}/${infer R}`
  ? ParamType<R, Params>
  : T extends `:${infer P}.${infer rssFormat}`
  ? { [K in P | keyof Params]: string }
  : T extends `:${infer P}`
  ? { [K in P | keyof Params]: string }
  : Params

type TestA = ParamType<'/:Oops/Bar/Foo/:test'> // { Oops: string; test: string; }
type TestAA = ParamType<'/:Oops/Bar/Foo/:test.rss'> // { Oops: string; test: string; }
type TestB = ParamType<'/:test'> // { Oops: string; }
type TestC = ParamType<'/Oops/Bar/Foo/test'> // {}
type TestD = ParamType<'/Oops/Bar/Foo/:test/'> // { test: string; }
type TestE = ParamType<'/Oops/:Bar/Foo/:test/Bar/'> // { Oops: string; test: string; }
type TestEE = ParamType<'/Oops/:Bar/Foo/:test/Bar.css/'> // { Oops: string; test: string; }
type TestF = ParamType<'/:a.rss'> // {}

export enum Changefreq {
  Always = 'always',
  Hourly = 'hourly',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
  Never = 'never'
}

export interface Route<Path extends string = string> {
  path: Path
  fetch: Fetcher<Path>
  schema?: RequestSchemas
  init?: RouteInit
  about?: RouteMeta
}

export interface RouteInit {
  expirationTTL?: NumStr
  expiration?: NumStr
}

export interface RouteMeta {
  changefreq?: Changefreq
}

// Will be used in KV storage.
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

export enum RSSFormat {
  RSS = 'rss',
  ATOM = 'atom',
  JSON = 'json'
}

export const RSSFormatList = Object.values(RSSFormat)

export enum CachePolicy {}

export type Info = Request | URL | string

export type Init = Omit<RequestInit, 'method' | 'body'>

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'

export type ErrorHandler = <E extends Error>(e: E) => any

export interface SitemapItem {
  loc: string
  lastmod?: Date
  changefreq?: Changefreq
  priority?: number
}

export interface Metadata {
  lastUpdated: number
  lastUpdateStatus: 'Successful' | 'Failed'
  route: string
}

export type LegalChar =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '0'
  | '_'
  | '-'
  | '+'
