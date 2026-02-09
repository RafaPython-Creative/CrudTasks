import fs from "node:fs/promises";

const DATABASE_PATH = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(DATABASE_PATH, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database, null, 2));
  }

  select(table, search) {
    const data = this.#database[table] ?? [];

    if (!search) return data;

    const { title, description } = search;

    return data.filter((row) => {
      const matchTitle = title
        ? row.title?.toLowerCase().includes(title.toLowerCase())
        : true;

      const matchDescription = description
        ? row.description?.toLowerCase().includes(description.toLowerCase())
        : true;

      return matchTitle && matchDescription;
    });
  }

  insert(table, data) {
    if (!this.#database[table]) this.#database[table] = [];
    this.#database[table].push(data);
    this.#persist();
    return data;
  }

  findById(table, id) {
    const data = this.#database[table] ?? [];
    return data.find((row) => row.id === id);
  }

  update(table, id, data) {
    const rows = this.#database[table] ?? [];
    const rowIndex = rows.findIndex((row) => row.id === id);

    if (rowIndex === -1) return null;

    rows[rowIndex] = { ...rows[rowIndex], ...data };
    this.#persist();
    return rows[rowIndex];
  }

  delete(table, id) {
    const rows = this.#database[table] ?? [];
    const rowIndex = rows.findIndex((row) => row.id === id);

    if (rowIndex === -1) return false;

    rows.splice(rowIndex, 1);
    this.#persist();
    return true;
  }
}
