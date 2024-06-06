import { Hono } from "hono"
import { cors } from "hono/cors"
import { Bindings } from "hono/types"
import * as model from "./model"

const api = new Hono<{ Bindings: Bindings }>()
api.use('/tasks/*', cors())

api.get('/', (c) => {
  return c.json({ message: 'Hello' })
})

api.get('/tasks', async (c) => {
  const tasks = await model.getTasks()
  return c.json(tasks)
})

api.post('/tasks', async (c) => {
  const param = await c.req.json()
  const newTask = await model.createTask(param as model.Task)
  if (!newTask) {
    return c.json({ error: 'Can not create new task', ok: false }, 422)
  }
  return c.json({ task: newTask, ok: true }, 201)
})

api.get('/tasks/:id', async (c) => {
  const id = c.req.param('id')
  const task = await model.getTask(id)
  if (!task) {
    return c.json({ error: 'Not Found', ok: false }, 404)
  }
  return c.json({ task: task, ok: true })
})

api.put('/tasks/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const task = await model.getTask(id)
  if (!task) {
    // 204 No Content
    return new Response(null, { status: 204 })
  }
  const param = await c.req.json()
  const success = await model.updateTask(id, param as model.Task)
  const updatedTask = await model.getTask(id)
  return c.json({ ok: success, task: updatedTask})
})

api.delete('/tasks/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const task = await model.getTask(id)
  if (!task) {
    // 204 No Content
    return new Response(null, { status: 204 })
  }
  const success = await model.deleteTask(id)
  return c.json({ ok: success })
})

export default api