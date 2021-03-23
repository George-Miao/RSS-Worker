export interface ZfrontierUserFlow {
  data: {
    list: Array<UserFlow> | []
  }
  msg: string
  ok: number
}
export interface UserFlow {
  canTranslate: boolean
  cid: number
  circle: Circle
  client_str: string
  created_at: string
  flow_type: number
  great: number
  has_zan: number
  hash_id: string
  hasLongTranslation: boolean
  hasTranslation: boolean
  hot: number
  id: number
  imgs: string[]
  is_disputed: number
  item_id: number
  item_type: number
  masonry_cover: MasonryCover
  past_time: string
  stat: Stat
  tags: Tag[]
  text: string
  title: string
  top: number
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  url: string
  user: User
  view_url: string
}

export interface TagFlow extends UserFlow {
  is_recommended?: number
  manage_menu: any[]
  translateFrom?: string
  translateId?: number
  translateTo?: string
  translationIsManual?: number
}

export interface Circle {
  canTranslate: boolean
  hasLongTranslation: boolean
  hasTranslation: boolean
  id: number
  name: string
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  url: string
}

export interface MasonryCover {
  f: ImageFormat
  h: number
  src: string
  w: number
}

export interface Stat {
  cnt_reply: number
  cnt_zan: number
}

export interface Tag {
  banner: string
  banner_url: string
  cnt_post: number
  cover: string
  id: number
  name: string
  type: number
  url: string
}

export interface User {
  avatar_path: string
  hash_id: string
  id: number
  nickname: string
  view_url: string
}

export enum ClientStr {
  Web = 'PC网页端',
  MiniApp = '微信小程序',
}

export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
}
