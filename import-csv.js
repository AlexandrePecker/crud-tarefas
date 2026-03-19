import { parse } from 'csv-parse'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.join(__dirname, 'tasks.csv')

async function importCSV() {
  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  )

  for await (const record of parser) {
    const { title, description } = record

    try {
      const response = await fetch('http://localhost:3334/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error(`Erro ao importar "${title}":`, error.message)
      } else {
        console.log(`Tarefa importada com sucesso: "${title}"`)
      }
    } catch (err) {
      console.error(`Falha na requisição para "${title}":`, err.message)
    }
  }
}

importCSV()
