import http from "node:http";
import { json } from "./utils/json.js";
import { routes } from "./routes.js";

function extractQueryParams(queryString) {
  if (!queryString) return {};
  const query = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString;
  return Object.fromEntries(new URLSearchParams(query));
}

const server = http.createServer(async (req, res) => {
  await json(req, res);

  const { method, url } = req;

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (!route) {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: "Rota não encontrada." }));
  }

  const routeMatch = url.match(route.path);

  const { query, ...params } = routeMatch.groups ?? {};

  req.params = params;
  req.query = extractQueryParams(query);

  return route.handler(req, res);
});

server.listen(3333, () => {
  console.log("🚀 Server running on http://localhost:3333");
});
