const express = require("express");
const router = express.Router();
const db = require("../config/database");
const auth = require("../middleware/auth");

router.use(auth);

// GET todos processos
router.get("/", async (req, res) => {
  try {
    const { status, area, search } = req.query;
    let query = `
      SELECT p.*, c.nome as cliente_nome 
      FROM processos p 
      LEFT JOIN clientes c ON p.cliente_id = c.id 
      WHERE p.advogado_id = ?
    `;
    const params = [req.advogadoId];

    if (status) {
      query += " AND p.status = ?";
      params.push(status);
    }
    if (area) {
      query += " AND p.area = ?";
      params.push(area);
    }
    if (search) {
      query += " AND (p.titulo LIKE ? OR p.numero_processo LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY p.created_at DESC";
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar processos" });
  }
});

// GET processo por ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT p.*, c.nome as cliente_nome FROM processos p LEFT JOIN clientes c ON p.cliente_id = c.id WHERE p.id = ? AND p.advogado_id = ?",
      [req.params.id, req.advogadoId],
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Processo não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar processo" });
  }
});

// POST criar processo
router.post("/", async (req, res) => {
  try {
    const {
      cliente_id,
      numero_processo,
      titulo,
      descricao,
      area,
      status,
      tribunal,
      vara,
      parte_contraria,
      data_abertura,
    } = req.body;
    const [result] = await db.execute(
      "INSERT INTO processos (advogado_id, cliente_id, numero_processo, titulo, descricao, area, status, tribunal, vara, parte_contraria, data_abertura) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.advogadoId,
        cliente_id || null,
        numero_processo || null,
        titulo,
        descricao || null,
        area || "outros",
        status || "ativo",
        tribunal || null,
        vara || null,
        parte_contraria || null,
        data_abertura || null,
      ],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Processo criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar processo" });
  }
});

// PUT atualizar processo
router.put("/:id", async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      area,
      status,
      tribunal,
      vara,
      parte_contraria,
      data_abertura,
      data_encerramento,
      numero_processo,
    } = req.body;
    await db.execute(
      "UPDATE processos SET titulo=?, descricao=?, area=?, status=?, tribunal=?, vara=?, parte_contraria=?, data_abertura=?, data_encerramento=?, numero_processo=? WHERE id=? AND advogado_id=?",
      [
        titulo,
        descricao || null,
        area,
        status,
        tribunal || null,
        vara || null,
        parte_contraria || null,
        data_abertura || null,
        data_encerramento || null,
        numero_processo || null,
        req.params.id,
        req.advogadoId,
      ],
    );
    res.json({ message: "Processo atualizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar processo" });
  }
});

// DELETE processo
router.delete("/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM processos WHERE id=? AND advogado_id=?", [
      req.params.id,
      req.advogadoId,
    ]);
    res.json({ message: "Processo excluído com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir processo" });
  }
});

module.exports = router;
