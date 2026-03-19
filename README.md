# Tasks API

API REST para gerenciamento de tarefas, construída com Node.js puro (sem frameworks externos).

## Requisitos

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Uso

**Iniciar o servidor:**
```bash
npm run dev
```

O servidor sobe na porta `3334`.

**Importar tarefas do CSV** (com o servidor rodando):
```bash
node import-csv.js
```

## Rotas

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| `GET` | `/tasks` | — | Lista todas as tarefas. Aceita `?search=termo` |
| `POST` | `/tasks` | `{ title, description }` | Cria uma nova tarefa |
| `PUT` | `/tasks/:id` | `{ title?, description? }` | Atualiza título e/ou descrição |
| `PATCH` | `/tasks/:id/complete` | — | Alterna `completed_at` (null ↔ data atual) |
| `DELETE` | `/tasks/:id` | — | Remove a tarefa |

## Modelo de tarefa

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "completed_at": null,
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z"
}
```

## Estrutura do projeto

```
src/
├── server.js                  — servidor HTTP, porta 3334
├── routes.js                  — definição das rotas
├── database.js                — persistência em db.json
├── middlewares/
│   └── json.js                — parse de body JSON
└── utils/
    └── build-route-path.js    — conversão de parâmetros de rota para regex
import-csv.js                  — importação de tarefas via CSV
tasks.csv                      — arquivo CSV de exemplo
```
