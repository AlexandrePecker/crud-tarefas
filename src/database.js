import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const databasePath = path.join(__dirname, '..', 'db.json')

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table]?.findIndex(row => row.id === id) ?? -1

    if (rowIndex < 0) return null

    const current = this.#database[table][rowIndex]
    this.#database[table][rowIndex] = { ...current, ...data }
    this.#persist()
    return this.#database[table][rowIndex]
  }

  delete(table, id) {
    const rowIndex = this.#database[table]?.findIndex(row => row.id === id) ?? -1

    if (rowIndex < 0) return null

    this.#database[table].splice(rowIndex, 1)
    this.#persist()
    return true
  }
}
