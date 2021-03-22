import app from '@/app/app'
import test from '@/test'

// Handle cron jobs
addEventListener('scheduled', event => {
  // event.waitUntil(handleCrontab())
})

if (ENV === 'test') {
  // Handle cron jobs
  addEventListener('fetch', event => {
    event.respondWith(test(event))
  })
} else {
  // Handle request
  app.listen()
}
