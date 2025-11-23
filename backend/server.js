const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

/* ===========================================
   ROTA: LISTAR APENAS HÁBITOS CONCLUÍDOS
=========================================== */
app.get("/habitos", (req, res) => {
  db.all("SELECT * FROM habitos WHERE concluido_hoje = 0", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* ===========================================
   ROTA: CRIAR HÁBITO
=========================================== */
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

/* ===========================================
   ROTA: CONCLUIR HÁBITO
=========================================== */
app.post("/habitos/:id/concluir", (req, res) => {
  const id = req.params.id;

  db.run(
    "UPDATE habitos SET concluido_hoje = 1 WHERE id = ?",
    [id],
    () => {
      db.run("UPDATE xp SET total = total + 10");

      db.get("SELECT total FROM xp", (err, row) => {
        res.json({ message: "Hábito concluído!", xp: row.total });
      });
    }
  );
});

/* ===========================================
   ROTA: EXCLUIR HÁBITO
=========================================== */
app.delete("/habitos/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM habitos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Hábito excluído!", id });
  });
});

/* ===========================================
   ROTA: PEGAR XP TOTAL
=========================================== */
app.get("/xp", (req, res) => {
  db.get("SELECT total FROM xp", (err, row) => {
    res.json(row);
  });
});

app.get("/habitos/concluidos", (req, res) => {
  db.all("SELECT * FROM habitos WHERE concluido_hoje = 1", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* ===========================================
   INICIAR SERVIDOR
=========================================== */
const PORT = 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
