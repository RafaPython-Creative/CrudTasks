# CrudTasks — uma API simples que vira “sistema” quando você coloca persistência no jogo ✅⚙️
![Imagem ilustrativa](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWtwajNzY2p2YTJwbnlya2I1Y253YTZycHFjZG5ldDI2aDBiemM1biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nea1LCYl8r8k0/giphy.gif)

Uma API em **Node.js** para criar, listar, atualizar e remover tarefas — com **persistência em arquivo `.csv`** e um script de **importação de tarefas via CSV**.

A graça aqui não é “fazer CRUD”. É lidar com os problemas reais:
**caminho de arquivo, stream, parse de body e integração com import.**

---

## O que esse projeto resolve

Você precisa de uma API de tarefas, mas sem banco, sem ORM, sem magia.
Só Node, HTTP e arquivo.

O **CrudTasks** entrega:
- CRUD completo de tarefas
- Persistência em `tasks.csv`
- Script `import-csv.js` para popular a base via CSV
- Estrutura limpa e evolutiva (perfeita pra virar um projeto maior depois)

---

Como rodar o projeto
1) Instalar dependências
npm install

2) Subir a API
npm run dev
# ou
node src/server.js


Se você usa nodemon, o dev geralmente aponta pra ele.

3) Garantir o arquivo de persistência

Se o projeto usa tasks.csv como base, garanta que ele existe no root:

type nul > tasks.csv   # Windows (cria arquivo vazio)
# ou
touch tasks.csv        # Linux/Mac

Rotas da API (CRUD)

Ajuste a base se sua API estiver com outro prefixo.

Criar tarefa
POST /tasks
Content-Type: application/json

{
  "title": "Estudar Node",
  "description": "Revisar streams e rotas"
}

Listar tarefas
GET /tasks

Atualizar tarefa
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Estudar Node (update)",
  "description": "Corrigir parsing do body"
}

Marcar como concluída
PATCH /tasks/:id/complete

Deletar tarefa
DELETE /tasks/:id

Importação via CSV

O script de importação envia cada linha do CSV para a API (via HTTP).
Pra funcionar:

✅ API rodando
✅ URL/porta corretas no import-csv.js
✅ CSV no formato esperado

Rodar:

node import-csv.js


Se der:

fetch failed + ECONNREFUSED → servidor não está rodando ou porta errada

ENOENT tasks.csv → arquivo/caminho não existe

Se você quiser versionar o tasks.csv como “base inicial vazia”, ok.
Se preferir não versionar dados, adicione:
tasks.csv

Roadmap (próximos upgrades naturais)
 Validação de payload (title/description obrigatórios)
 Filtro e busca (?search=) no GET /tasks
 Paginação
 Persistência em SQLite/Postgres (mantendo a mesma API)
 Testes (supertest) + CI
 <p align="center">
  <img src="https://github.com/user-attachments/assets/bd717183-deca-4196-9895-3829e13cdca1" width="800" />
 </p>
```md



