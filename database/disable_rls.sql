-- Script para desabilitar o RLS (Row Level Security) nas tabelas do Sistema Mineradora
-- Execute este script no SQL Editor do Supabase APÓS ter rodado o script de criação de tabelas (schema.sql)

ALTER TABLE min_cidades DISABLE ROW LEVEL SECURITY;
ALTER TABLE min_equipamentos DISABLE ROW LEVEL SECURITY;
ALTER TABLE min_funcionarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE min_servicos DISABLE ROW LEVEL SECURITY;
