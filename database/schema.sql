-- Script de criação das tabelas para o Sistema Mineradora
-- IMPORTANTE: Tabelas prefixadas com 'min_' para evitar conflito com outros projetos

DROP TABLE IF EXISTS min_servicos CASCADE;
DROP TABLE IF EXISTS min_funcionarios CASCADE;
DROP TABLE IF EXISTS min_equipamentos CASCADE;
DROP TABLE IF EXISTS min_cidades CASCADE;

-- Tabela Cidades
CREATE TABLE min_cidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- Tabela Equipamentos
CREATE TABLE min_equipamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    patrimonio VARCHAR(100) NOT NULL UNIQUE,
    setor VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Disponível' -- Disponível, Em manutenção, Em uso, Inativo
);

-- Tabela Funcionários
CREATE TABLE min_funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    cidade_id INTEGER REFERENCES min_cidades(id) ON DELETE SET NULL
);

-- Tabela Serviços (Manutenção/Operação de Equipamentos)
CREATE TABLE min_servicos (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL,
    equipamento_id INTEGER REFERENCES min_equipamentos(id) ON DELETE CASCADE,
    funcionario_id INTEGER REFERENCES min_funcionarios(id) ON DELETE SET NULL,
    data_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pendente' -- Pendente, Em progresso, Concluído, Cancelado
);

