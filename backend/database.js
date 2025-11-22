const sqlite3 = require("sqlite3").verbose();

// Cria/conecta ao banco
const db = new sqlite3.Database("./lopsify.db");

// Cria tabelas se não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS habitos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT,
      concluido_hoje INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS xp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total INTEGER DEFAULT 0
    )
  `);

  // Garante que sempre existe um registro de XP
  db.get("SELECT * FROM xp", (err, row) => {
    if (!row) {
      db.run("INSERT INTO xp (total) VALUES (0)");
    }
  });
});

module.exports = db;
