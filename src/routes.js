import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

function badRequest(res, message) {
  res.writeHead(400);
  return res.end(JSON.stringify({ error: message }));
}

function notFound(res, message) {
  res.writeHead(404);
  return res.end(JSON.stringify({ error: message }));
}

export const routes = [
  // POST /tasks
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const body = req.body;

      if (!body) return badRequest(res, "Body inválido ou ausente.");

      const { title, description } = body;

      if (!title || !description) {
        return badRequest(
          res,
          'Campos "title" e "description" são obrigatórios.',
        );
      }

      const now = new Date()
        .toLocaleString("sv-SE", {
          timeZone: "America/Sao_Paulo",
        })
        .replace(" ", "T");

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: now,
        updated_at: now,
      };

      database.insert("tasks", task);

      res.writeHead(201);
      return res.end(JSON.stringify(task));
    },
  },

  // GET /tasks?title=...&description=...
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const { title, description } = req.query ?? {};

      const tasks = database.select("tasks", {
        title,
        description,
      });

      res.writeHead(200);
      return res.end(JSON.stringify(tasks));
    },
  },

  // PUT /tasks/:id
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const body = req.body;

      if (!body) return badRequest(res, "Body inválido ou ausente.");

      const { title, description } = body;

      if (!title && !description) {
        return badRequest(
          res,
          'Envie "title" e/ou "description" para atualizar.',
        );
      }

      const existing = database.findById("tasks", id);
      if (!existing) return notFound(res, `Task com id "${id}" não existe.`);

      const updated = database.update("tasks", id, {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        updated_at: new Date().toISOString(),
      });

      res.writeHead(200);
      return res.end(JSON.stringify(updated));
    },
  },

  // DELETE /tasks/:id
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;

      const existing = database.findById("tasks", id);
      if (!existing) return notFound(res, `Task com id "${id}" não existe.`);

      const ok = database.delete("tasks", id);
      if (!ok) return notFound(res, `Task com id "${id}" não existe.`);

      res.writeHead(204);
      return res.end();
    },
  },

  // PATCH /tasks/:id/complete
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (req, res) => {
      const { id } = req.params;

      const existing = database.findById("tasks", id);
      if (!existing) return notFound(res, `Task com id "${id}" não existe.`);

      const now = new Date()
        .toLocaleString("sv-SE", {
          timeZone: "America/Sao_Paulo",
        })
        .replace(" ", "T");
      const toggled = database.update("tasks", id, {
        completed_at: existing.completed_at ? null : now,
        updated_at: now,
      });

      res.writeHead(200);
      return res.end(JSON.stringify(toggled));
    },
  },
];
