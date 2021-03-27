import * as fs from 'fs'

import db from './tags.json'

interface Tag {
  tagId: number
  type: number
  name: string
  cover?: string | undefined
  banner?: string | undefined
  banner_url?: string | undefined
}

const tags = db
  .map(
    (e: Tag) =>
      [e.tagId, e.type, e.name, e.banner ? 'https:' + e.banner : ''] as [
        number,
        number,
        string,
        string
      ]
  )
  .sort((a, b) => a[0] - b[0])

fs.writeFileSync('src/tags.processed.json', JSON.stringify(tags))
