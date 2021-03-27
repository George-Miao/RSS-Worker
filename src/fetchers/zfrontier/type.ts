export interface ZfrontierAPI<Data> {
  ok: number
  msg: string
  data: Data
}

export type ZfrontierUserFlow = ZfrontierAPI<{
  list: Array<UserFlow> | []
}>

export type ZfrontierTagFlow = ZfrontierAPI<{
  list: Array<TagFlow> | []
}>

export type ZfrontierPostContent = ZfrontierAPI<{
  flow: FlowContent
  zanUsers: any[]
  userFlows: UserFlow[]
  rcmdFlows: RcmdFlow[]
  showStatus: any[]
}>

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

export interface FlowContent {
  id: number
  item_type: number
  item_id: number
  top: number
  hot: number
  great: number
  heat: number
  flow_type: number
  is_disputed: number
  disputed_notice: null
  cid: number
  created_at: string
  last_reply_at: null
  imgs: string[]
  text: string
  stat: Stat
  past_time: string
  is_edit_locked: boolean
  manage_menu: any[]
  hash_id: string
  view_url: string
  tags: Tag[]
  has_zan: number
  has_fav: number
  share_config: ShareConfig
  client_str: string
  title: string
  url: string
  canTranslate: boolean
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  hasTranslation: boolean
  hasLongTranslation: boolean
  translateOrigins: any[]
  item: FlowContentItem
  user: FlowContentUser
  circle: FlowCircle
  plate: null
  lottery: null
  trade_detail: null
}

export interface FlowCircle {
  id: number
  name: string
  desc: string
  icon: string
  cnt_user: number
  cnt_contents: number
  canTranslate: boolean
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  hasTranslation: boolean
  hasLongTranslation: boolean
  translate: null
}

export interface FlowContentItem {
  title: string
  picsExif: any[]
  equips: any[]
  canTranslate: boolean
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  hasTranslation: boolean
  hasLongTranslation: boolean
  translateOrigins: any[]
  article: FlowContentArticle
}

export interface FlowContentArticle {
  text: string
  content: string
  canTranslate: boolean
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  hasTranslation: boolean
  hasLongTranslation: boolean
  translateOrigins: any[]
}

export interface ShareConfig {
  title: string
  sub_title: string
  link: string
  thumb: string
  bigCover: string
}

export interface Stat {
  cnt_zan: number
  cnt_reply: number
}

export interface Tag {
  id: number
  type: number
  cnt_post: number
  name: string
  cover: string
  banner: null | string
  url: string
  banner_url: string
}

export interface FlowContentUser {
  id: number
  nickname: string
  verify_info: string
  avatar_path: string
  bio: null
  cnt_zan_rcv: number
  cnt_post: number
  cnt_sign_eqp: number
  verify_class: string
  view_url: string
}

export interface RcmdFlow {
  id: number
  item_type: number
  item_id: number
  top: number
  hot: number
  great: number
  flow_type: number
  is_disputed: number
  cid: number
  created_at: string
  imgs: string[]
  text: string
  masonry_cover: string
  stat: Stat
  past_time: string
  hash_id: string
  view_url: string
  has_zan: number
  client_str: string
  title: string
  url: string
  canTranslate: boolean
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  hasTranslation: boolean
  hasLongTranslation: boolean
  user: RcmdFlowUser
  circle: RcmdFlowCircle
  tags: Tag[]
}

export interface RcmdFlowCircle {
  id: number
  name: string
  url: string
  canTranslate: boolean
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  hasTranslation: boolean
  hasLongTranslation: boolean
}

export interface RcmdFlowUser {
  id: number
  nickname: string
  avatar_path: string
  hash_id: string
  view_url: string
}

export interface UserFlowContent {
  id: number
  item_type: number
  item_id: number
  top: number
  hot: number
  great: number
  flow_type: number
  is_disputed: number
  cid: number
  created_at: string
  imgs: string[]
  text: string
  masonry_cover: MasonryCover | string
  stat: Stat
  past_time: string
  hash_id: string
  view_url: string
  has_zan: number
  client_str: string
  title: string
  url: string
  canTranslate: boolean
  translateDisabled: boolean
  translateLanguageDisabled: boolean
  hasTranslation: boolean
  hasLongTranslation: boolean
  user: RcmdFlowUser
  circle: RcmdFlowCircle
  tags: Tag[]
}
