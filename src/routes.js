import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body ?? {}

      if (!title || !description) {
        return res.json(
          { message: 'Os campos "title" e "description" são obrigatórios.' },
          400
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.json(task, 201)
    },
  },

  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query ?? {}

      const tasks = database.select(
        'tasks',
        search ? { title: search, description: search } : null
      )

      return res.json(tasks)
    },
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body ?? {}

      if (!title && !description) {
        return res.json(
          { message: 'Informe ao menos "title" ou "description" para atualizar.' },
          400
        )
      }

      const [task] = database.select('tasks', null).filter(t => t.id === id)

      if (!task) {
        return res.json({ message: 'Tarefa não encontrada.' }, 404)
      }

      database.update('tasks', id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      })

      res.writeHead(204)
      return res.end()
    },
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', null).filter(t => t.id === id)

      if (!task) {
        return res.json({ message: 'Tarefa não encontrada.' }, 404)
      }

      database.delete('tasks', id)

      res.writeHead(204)
      return res.end()
    },
  },

  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', null).filter(t => t.id === id)

      if (!task) {
        return res.json({ message: 'Tarefa não encontrada.' }, 404)
      }

      const completedAt = task.completed_at ? null : new Date()

      database.update('tasks', id, {
        completed_at: completedAt,
        updated_at: new Date(),
      })

      res.writeHead(204)
      return res.end()
    },
  },
]
