import { log } from '@/toolkit'
import { Application, validate } from '@cfworker/web'

import router from './router'

const app = new Application()
app
  .use(
    validate({
      search: {
        properties: {
          type: {
            type: 'string',
            enum: ['json', 'atom', 'rss'],
          },
        },
      },
    }),
  )
  .use(router.middleware)

export default app
