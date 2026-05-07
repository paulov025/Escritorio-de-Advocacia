const express = require("express");
const router = express.Router();
const db = require("../config/database");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT d.*, p.titulo as processo_titulo, c.nome as cliente_nome 
       FROM documentos d 
       LEFT JOIN processos p ON d.processo_id = p.id 
       LEFT JOIN clientes c ON d.cliente_id = c.id 
       WHERE d.advogado_id = ? ORDER BY d.created_at DESC`,
      [req.advogadoId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { processo_id, cliente_id, titulo, tipo, descricao, nome_arquivo } =
      req.body;
    const [result] = await db.execute(
      "INSERT INTO documentos (advogado_id, processo_id, cliente_id, titulo, tipo, descricao, nome_arquivo) VALUES (?,?,?,?,?,?,?)",
      [
        req.advogadoId,
        processo_id || null,
        cliente_id || null,
        titulo,
        tipo || null,
        descricao || null,
        nome_arquivo || null,
      ],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Documento registrado!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar documento" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM documentos WHERE id=? AND advogado_id=?", [
      req.params.id,
      req.advogadoId,
    ]);
    res.json({ message: "Documento excluído!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir documento" });
  }
});

module.exports = router;
