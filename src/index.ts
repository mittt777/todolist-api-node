import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import api from './api'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))

app.route('/api', api)

const port = 8080
console.log(`Server is running on  http://localhost:${port}/api`)

serve({
  fetch: app.fetch,
  port
})
