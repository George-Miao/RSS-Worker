import { ZfrontierPostContent } from '@/fetchers/zfrontier/type'
import { FetchInternalError, FetchSourceError } from './toolkit'

import { Info, Init, ErrorHandler, Method } from './type'

const isObj = (obj: any) =>
  obj && obj.constructor === Object && !Array.isArray(obj)

const isEmpty = (obj: Object) => isObj(obj) && Object.keys(obj).length === 0

const deepAssign = (target: Record<string, any>, src: Record<string, any>) => {
  if (isEmpty(src)) {
    return target
  }
  if (isObj(target) && isObj(src)) {
    for (const key in src) {
      if (isObj(src[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} })
        } else {
          target[key] = Object.assign({}, target[key])
        }
        deepAssign(target[key], src[key])
      } else {
        Object.assign(target, { [key]: src[key] })
      }
    }
  }
}

const infoToRequestInfo = (info: Info): RequestInfo => {
  return info instanceof URL ? info.toString() : info
}

export default class Req {
  private reqInit: RequestInit = {}
  private initPromise: Promise<Init> | undefined = undefined
  private reqInfo: RequestInfo
  private bodyPromise: Promise<BodyInit> | undefined = undefined
  private handleError: ErrorHandler = <E extends Error>(e: E) => {
    console.error(`Error during fetching ${this.url}`, e.stack ?? e.toString())
    throw e
  }

  constructor(info: Info) {
    this.reqInfo = infoToRequestInfo(info)
  }

  static get(info: Info, init?: Init): Req {
    return new Req(info).get.with(init)
  }
  static post(info: Info, init?: Init): Req {
    return new Req(info).post.with(init)
  }
  static put(info: Info, init?: Init): Req {
    return new Req(info).put.with(init)
  }
  static delete(info: Info, init?: Init): Req {
    return new Req(info).delete.with(init)
  }
  static patch(info: Info, init?: Init): Req {
    return new Req(info).patch.with(init)
  }
  static head(info: Info, init?: Init): Req {
    return new Req(info).head.with(init)
  }

  get url(): string {
    return typeof this.reqInfo === 'string'
      ? this.reqInfo
      : this.reqInfo.url.toString()
  }

  get get(): Req {
    return this.method('GET')
  }
  get post(): Req {
    return this.method('POST')
  }
  get put(): Req {
    return this.method('PUT')
  }
  get delete(): Req {
    return this.method('DELETE')
  }
  get patch(): Req {
    return this.method('PATCH')
  }
  get head(): Req {
    return this.method('HEAD')
  }

  method(method: Method): Req {
    this.reqInit.method = method
    return this
  }

  with(initLoader: (req: Req) => Init): Req
  with(initLoader: (req: Req) => Promise<Init>): Req
  with(init: Init | undefined): Req
  with(
    init:
      | Init
      | ((req: Req) => Init)
      | ((req: Req) => Promise<Init>)
      | undefined
  ): Req {
    if (init instanceof Function) {
      const called = init(this)
      if (called instanceof Promise) {
        this.initPromise = called
      } else {
        Object.assign(this.reqInit, called)
      }
    } else if (init) Object.assign(this.reqInit, init)
    return this
  }

  load(bodyLoader: (req: Req) => BodyInit): Req
  load(bodyLoader: (req: Req) => Promise<BodyInit>): Req
  load(bodyInit: BodyInit | undefined): Req
  load(
    bodyInit:
      | BodyInit
      | ((req: Req) => BodyInit)
      | ((req: Req) => Promise<BodyInit>)
      | undefined
  ): Req {
    if (bodyInit instanceof Function) {
      const called = bodyInit(this)
      if (called instanceof Promise) {
        this.bodyPromise = called
      } else {
        this.reqInit.body = called
      }
    } else if (bodyInit) this.reqInit.body = bodyInit
    return this
  }

  set<K extends keyof Init>(key: K, value: Init[K]): Req {
    this.reqInit[key] = value
    return this
  }

  except(exceptInit: ErrorHandler): Req {
    this.handleError = exceptInit
    return this
  }

  async fire(): Promise<Response> {
    if (this.bodyPromise) this.reqInit.body = await this.bodyPromise
    if (this.initPromise) Object.assign(this.reqInit, await this.initPromise)
    console.log(`[Req] Firing up <=> ${this.url}`)
    console.debug(`[Req] Init: `, this.reqInit)
    const res = await fetch(this.reqInfo, this.reqInit)
    console.log(`[Req] fetch returned ${res.status}: ${res.statusText}`)
    if (!res.ok || res.status >= 300 || res.status < 200)
      this.handleError(new FetchSourceError(`${res.status}: ${res.statusText}`))
    return res
  }

  async json<T = any>(): Promise<T> {
    return await this.fire().then(e => e.json() as Promise<T>)
  }

  async text(): Promise<string> {
    return await this.fire().then(e => e.text())
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return await this.fire().then(e => e.arrayBuffer())
  }

  async blob(): Promise<Blob> {
    return await this.fire().then(e => e.blob())
  }

  async formData(): Promise<FormData> {
    return await this.fire().then(e => e.formData())
  }
}
