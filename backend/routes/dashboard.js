const express = require("express");
const router = express.Router();
const db = require("../config/database");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const id = req.advogadoId;

    const [[processos]] = await db.execute(
      'SELECT COUNT(*) as total, SUM(status="ativo") as ativos, SUM(status="encerrado") as encerrados FROM processos WHERE advogado_id=?',
      [id],
    );
    const [[clientes]] = await db.execute(
      "SELECT COUNT(*) as total FROM clientes WHERE advogado_id=?",
      [id],
    );
    const [[prazos]] = await db.execute(
      `SELECT COUNT(*) as total, 
       SUM(status="pendente" AND data_prazo >= CURDATE()) as proximos,
       SUM(status="pendente" AND data_prazo < CURDATE()) as vencidos
       FROM prazos WHERE advogado_id=?`,
      [id],
    );
    const [[financeiro]] = await db.execute(
      `SELECT 
        SUM(CASE WHEN status="pago" THEN valor ELSE 0 END) as recebido,
        SUM(CASE WHEN status="pendente" THEN valor ELSE 0 END) as pendente
       FROM honorarios WHERE advogado_id=?`,
      [id],
    );

    const [prazosProximos] = await db.execute(
      `SELECT pr.*, p.titulo as processo_titulo 
       FROM prazos pr LEFT JOIN processos p ON pr.processo_id = p.id 
       WHERE pr.advogado_id=? AND pr.status="pendente" AND pr.data_prazo >= CURDATE() 
       ORDER BY pr.data_prazo ASC LIMIT 5`,
      [id],
    );

    const [processosRecentes] = await db.execute(
      `SELECT p.*, c.nome as cliente_nome 
       FROM processos p LEFT JOIN clientes c ON p.cliente_id = c.id 
       WHERE p.advogado_id=? ORDER BY p.created_at DESC LIMIT 5`,
      [id],
    );

    res.json({
      stats: { processos, clientes, prazos, financeiro },
      prazosProximos,
      processosRecentes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dashboard" });
  }
});

module.exports = router;
