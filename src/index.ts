import app from '@/feed/app'

// Handle cron jobs
addEventListener('scheduled', event => {
  // event.waitUntil(handleCrontab())
})

// Handle request
app.listen()
