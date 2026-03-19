import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = url.match(route.path)
    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? Object.fromEntries(new URLSearchParams(query)) : {}

    return route.handler(req, res)
  }

  res.writeHead(404)
  return res.end(JSON.stringify({ message: 'Rota não encontrada.' }))
})

server.listen(3334, () => {
  console.log('Server running at http://localhost:3334')
})
