/**
 * @description Represent any internal errors that cannot be handelled
 * @emits 500 response code
 * @example error during processing data
 */
export class FetchInternalError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'FetchInternalError'
  }
}

/**
 * @description Represent any error related to data source
 * @emits 404 response code
 * @example Data source returns wrong file format or it blocks the IP
 */
export class FetchSourceError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'FetchSourceError'
  }
}

/**
 * @description Represent any NotFound error, like Http 404
 * @emits 404 response code
 * @example Data source returns 404 for the userId
 */
export class FetchNotFoundError extends FetchSourceError {
  constructor(message?: string) {
    super(message)
    this.name = 'FetchNotFoundError'
  }
}
