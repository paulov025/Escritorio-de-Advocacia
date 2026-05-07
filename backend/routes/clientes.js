const express = require("express");
const router = express.Router();
const db = require("../config/database");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM clientes WHERE advogado_id = ?";
    const params = [req.advogadoId];
    if (search) {
      query += " AND (nome LIKE ? OR email LIKE ? OR cpf_cnpj LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    query += " ORDER BY nome ASC";
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM clientes WHERE id=? AND advogado_id=?",
      [req.params.id, req.advogadoId],
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Cliente não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, cpf_cnpj, email, telefone, endereco, tipo, observacoes } =
      req.body;
    const [result] = await db.execute(
      "INSERT INTO clientes (advogado_id, nome, cpf_cnpj, email, telefone, endereco, tipo, observacoes) VALUES (?,?,?,?,?,?,?,?)",
      [
        req.advogadoId,
        nome,
        cpf_cnpj || null,
        email || null,
        telefone || null,
        endereco || null,
        tipo || "pessoa_fisica",
        observacoes || null,
      ],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        message: "Cliente cadastrado com sucesso!",
      });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { nome, cpf_cnpj, email, telefone, endereco, tipo, observacoes } =
      req.body;
    await db.execute(
      "UPDATE clientes SET nome=?, cpf_cnpj=?, email=?, telefone=?, endereco=?, tipo=?, observacoes=? WHERE id=? AND advogado_id=?",
      [
        nome,
        cpf_cnpj || null,
        email || null,
        telefone || null,
        endereco || null,
        tipo || "pessoa_fisica",
        observacoes || null,
        req.params.id,
        req.advogadoId,
      ],
    );
    res.json({ message: "Cliente atualizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM clientes WHERE id=? AND advogado_id=?", [
      req.params.id,
      req.advogadoId,
    ]);
    res.json({ message: "Cliente excluído!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir cliente" });
  }
});

module.exports = router;
