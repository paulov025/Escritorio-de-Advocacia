const express = require("express");
const router = express.Router();
const db = require("../config/database");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const { status, prioridade } = req.query;
    let query = `
      SELECT pr.*, p.titulo as processo_titulo 
      FROM prazos pr 
      LEFT JOIN processos p ON pr.processo_id = p.id 
      WHERE pr.advogado_id = ?
    `;
    const params = [req.advogadoId];
    if (status) {
      query += " AND pr.status = ?";
      params.push(status);
    }
    if (prioridade) {
      query += " AND pr.prioridade = ?";
      params.push(prioridade);
    }
    query += " ORDER BY pr.data_prazo ASC";
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar prazos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      processo_id,
      titulo,
      descricao,
      data_prazo,
      hora_prazo,
      prioridade,
    } = req.body;
    const [result] = await db.execute(
      "INSERT INTO prazos (advogado_id, processo_id, titulo, descricao, data_prazo, hora_prazo, prioridade) VALUES (?,?,?,?,?,?,?)",
      [
        req.advogadoId,
        processo_id || null,
        titulo,
        descricao || null,
        data_prazo,
        hora_prazo || null,
        prioridade || "media",
      ],
    );
    res.status(201).json({ id: result.insertId, message: "Prazo adicionado!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar prazo" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { titulo, descricao, data_prazo, hora_prazo, prioridade, status } =
      req.body;
    await db.execute(
      "UPDATE prazos SET titulo=?, descricao=?, data_prazo=?, hora_prazo=?, prioridade=?, status=? WHERE id=? AND advogado_id=?",
      [
        titulo,
        descricao || null,
        data_prazo,
        hora_prazo || null,
        prioridade,
        status,
        req.params.id,
        req.advogadoId,
      ],
    );
    res.json({ message: "Prazo atualizado!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar prazo" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM prazos WHERE id=? AND advogado_id=?", [
      req.params.id,
      req.advogadoId,
    ]);
    res.json({ message: "Prazo excluído!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir prazo" });
  }
});

module.exports = router;
