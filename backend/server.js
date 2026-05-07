require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const processosRoutes = require("./routes/processos");
const clientesRoutes = require("./routes/clientes");
const prazosRoutes = require("./routes/prazos");
const financeiroRoutes = require("./routes/financeiro");
const documentosRoutes = require("./routes/documentos");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/processos", processosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/prazos", prazosRoutes);
app.use("/api/financeiro", financeiroRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LexFlow Server rodando na porta ${PORT}`);
});
