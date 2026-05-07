const express = require("express");
const router = express.Router();
const db = require("../config/database");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT h.*, c.nome as cliente_nome, p.titulo as processo_titulo 
       FROM honorarios h 
       LEFT JOIN clientes c ON h.cliente_id = c.id 
       LEFT JOIN processos p ON h.processo_id = p.id 
       WHERE h.advogado_id = ? 
       ORDER BY h.data_vencimento ASC`,
      [req.advogadoId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar honorários" });
  }
});

router.get("/resumo", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        SUM(CASE WHEN status='pago' THEN valor ELSE 0 END) as total_recebido,
        SUM(CASE WHEN status='pendente' THEN valor ELSE 0 END) as total_pendente,
        SUM(CASE WHEN status='parcial' THEN valor ELSE 0 END) as total_parcial,
        COUNT(*) as total_registros
       FROM honorarios WHERE advogado_id = ?`,
      [req.advogadoId],
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar resumo" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      cliente_id,
      processo_id,
      descricao,
      tipo,
      valor,
      status,
      data_vencimento,
      observacoes,
    } = req.body;
    const [result] = await db.execute(
      "INSERT INTO honorarios (advogado_id, cliente_id, processo_id, descricao, tipo, valor, status, data_vencimento, observacoes) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        req.advogadoId,
        cliente_id || null,
        processo_id || null,
        descricao,
        tipo || "fixo",
        valor,
        status || "pendente",
        data_vencimento || null,
        observacoes || null,
      ],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Honorário cadastrado!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar honorário" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      descricao,
      tipo,
      valor,
      status,
      data_vencimento,
      data_pagamento,
      observacoes,
    } = req.body;
    await db.execute(
      "UPDATE honorarios SET descricao=?, tipo=?, valor=?, status=?, data_vencimento=?, data_pagamento=?, observacoes=? WHERE id=? AND advogado_id=?",
      [
        descricao,
        tipo,
        valor,
        status,
        data_vencimento || null,
        data_pagamento || null,
        observacoes || null,
        req.params.id,
        req.advogadoId,
      ],
    );
    res.json({ message: "Honorário atualizado!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar honorário" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM honorarios WHERE id=? AND advogado_id=?", [
      req.params.id,
      req.advogadoId,
    ]);
    res.json({ message: "Honorário excluído!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir" });
  }
});

module.exports = router;
