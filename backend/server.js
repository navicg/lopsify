const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

// Rota: listar hábitos
app.get("/habitos", (req, res) => {
  db.all("SELECT * FROM habitos", (err, rows) => {
    res.json(rows);
  });
});

// Rota: criar hábito
app.post("/habitos", (req, res) => {
  const { nome, categoria } = req.body;

  db.run(
    "INSERT INTO habitos (nome, categoria) VALUES (?, ?)",
    [nome, categoria],
    function () {
      res.json({ id: this.lastID, nome, categoria });
    }
  );
});

// Rota: concluir hábito
app.post("/habitos/:id/concluir", (req, res) => {
  const id = req.params.id;

  // Marca como concluído
  db.run(
    "UPDATE habitos SET concluido_hoje = 1 WHERE id = ?",
    [id],
    () => {
      // Adiciona XP
      db.run("UPDATE xp SET total = total + 10");

      db.get("SELECT total FROM xp", (err, row) => {
        res.json({ message: "Hábito concluído!", xp: row.total });
      });
    }
  );
});

// Rota: pegar XP total
app.get("/xp", (req, res) => {
  db.get("SELECT total FROM xp", (err, row) => {
    res.json(row);
  });
});

// Inicia servidor
const PORT = 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
