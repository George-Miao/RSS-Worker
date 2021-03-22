export interface ZfrontierUserFlow {
  data: {
    list: Array<Flow> | []
  }
  msg: string
  ok: number
}

export interface Flow {
  canTranslate: boolean
  cid: number
  circle: Circle
  client_str: string
  created_at: string
  flow_type: number
  great: number
  hasLongTranslation: boolean
  hasTranslation: boolean
  has_zan: number
  hash_id: string
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
  f: string
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
