export async function json(req, res) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = buffers.length
      ? JSON.parse(Buffer.concat(buffers).toString())
      : null;
  } catch {
    req.body = null;
  }

  res.setHeader("Content-Type", "application/json");
}
