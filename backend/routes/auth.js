const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// POST /api/auth/cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, telefone, senha, oab, especialidade } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios" });
    }

    const [existing] = await db.execute(
      "SELECT id FROM advogados WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const [result] = await db.execute(
      "INSERT INTO advogados (nome, email, telefone, senha, oab, especialidade) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nome,
        email,
        telefone || null,
        senhaHash,
        oab || null,
        especialidade || null,
      ],
    );

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET || "lexflow_secret_2024",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "Cadastro realizado com sucesso!",
      token,
      advogado: {
        id: result.insertId,
        nome,
        email,
        telefone,
        oab,
        especialidade,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const [rows] = await db.execute("SELECT * FROM advogados WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const advogado = rows[0];
    const senhaValida = await bcrypt.compare(senha, advogado.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: advogado.id, email: advogado.email },
      process.env.JWT_SECRET || "lexflow_secret_2024",
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login realizado com sucesso!",
      token,
      advogado: {
        id: advogado.id,
        nome: advogado.nome,
        email: advogado.email,
        telefone: advogado.telefone,
        oab: advogado.oab,
        especialidade: advogado.especialidade,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/auth/perfil
const authMiddleware = require("../middleware/auth");
router.get("/perfil", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, nome, email, telefone, oab, especialidade, created_at FROM advogados WHERE id = ?",
      [req.advogadoId],
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Advogado não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
