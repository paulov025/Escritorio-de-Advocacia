-- LexFlow - Schema do Banco de Dados
-- Execute este arquivo no MySQL para criar as tabelas

CREATE DATABASE IF NOT EXISTS lexflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lexflow;

-- Tabela de Advogados
CREATE TABLE IF NOT EXISTS advogados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  senha VARCHAR(255) NOT NULL,
  oab VARCHAR(20),
  especialidade VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advogado_id INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  cpf_cnpj VARCHAR(20),
  email VARCHAR(150),
  telefone VARCHAR(20),
  endereco TEXT,
  tipo ENUM('pessoa_fisica', 'pessoa_juridica') DEFAULT 'pessoa_fisica',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advogado_id) REFERENCES advogados(id) ON DELETE CASCADE
);

-- Tabela de Processos
CREATE TABLE IF NOT EXISTS processos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advogado_id INT NOT NULL,
  cliente_id INT,
  numero_processo VARCHAR(50),
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  area ENUM('trabalhista','civil','criminal','tributario','previdenciario','familia','outros') DEFAULT 'outros',
  status ENUM('ativo','arquivado','encerrado','aguardando') DEFAULT 'ativo',
  tribunal VARCHAR(100),
  vara VARCHAR(100),
  parte_contraria VARCHAR(150),
  data_abertura DATE,
  data_encerramento DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (advogado_id) REFERENCES advogados(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- Tabela de Prazos
CREATE TABLE IF NOT EXISTS prazos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advogado_id INT NOT NULL,
  processo_id INT,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  data_prazo DATE NOT NULL,
  hora_prazo TIME,
  prioridade ENUM('baixa','media','alta','urgente') DEFAULT 'media',
  status ENUM('pendente','concluido','cancelado') DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advogado_id) REFERENCES advogados(id) ON DELETE CASCADE,
  FOREIGN KEY (processo_id) REFERENCES processos(id) ON DELETE SET NULL
);

-- Tabela de Honorários
CREATE TABLE IF NOT EXISTS honorarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advogado_id INT NOT NULL,
  cliente_id INT,
  processo_id INT,
  descricao VARCHAR(200) NOT NULL,
  tipo ENUM('fixo','percentual','hora','exito') DEFAULT 'fixo',
  valor DECIMAL(12,2) NOT NULL,
  status ENUM('pendente','pago','parcial','cancelado') DEFAULT 'pendente',
  data_vencimento DATE,
  data_pagamento DATE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advogado_id) REFERENCES advogados(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY (processo_id) REFERENCES processos(id) ON DELETE SET NULL
);

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advogado_id INT NOT NULL,
  processo_id INT,
  cliente_id INT,
  titulo VARCHAR(200) NOT NULL,
  tipo VARCHAR(50),
  descricao TEXT,
  nome_arquivo VARCHAR(255),
  caminho_arquivo VARCHAR(500),
  tamanho INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advogado_id) REFERENCES advogados(id) ON DELETE CASCADE,
  FOREIGN KEY (processo_id) REFERENCES processos(id) ON DELETE SET NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- Dados de exemplo
INSERT INTO advogados (nome, email, telefone, senha, oab, especialidade) VALUES
('Dr. João Silva', 'joao@lexflow.com', '(11) 99999-0000', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'OAB/SP 123456', 'Direito Trabalhista');
-- Senha padrão: password