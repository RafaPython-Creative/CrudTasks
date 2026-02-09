import fs from "node:fs";
import { parse } from "csv-parse";

const csvPath = new URL("./tasks.csv", import.meta.url);

async function importTasks() {
  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      columns: true, // usa a primeira linha como header: title,description
      skip_empty_lines: true,
      trim: true,
    }),
  );

  let count = 0;

  for await (const record of parser) {
    const title = record.title;
    const description = record.description;

    if (!title || !description) continue;

    const res = await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.log("Falhou na linha", count + 1, "->", text);
      continue;
    }

    count++;
  }

  console.log(`✅ Importadas: ${count} tasks`);
}

importTasks().catch(console.error);
