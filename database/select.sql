-- Script com consultas de testes (Selects) para o Sistema Mineradora
-- Execute estes comandos no SQL Editor do Supabase para inspecionar os dados salvos

-- 1. Consultar todas as cidades
SELECT * FROM min_cidades ORDER BY id ASC;


-- 2. Consultar todos os equipamentos
SELECT * FROM min_equipamentos ORDER BY id ASC;


-- 3. Consultar todos os funcionários mostrando o polo/cidade de atuação associado
SELECT 
    func.id AS funcionario_id,
    func.nome AS funcionario_nome,
    func.cargo,
    cid.nome AS cidade_nome
FROM min_funcionarios func
LEFT JOIN min_cidades cid ON func.cidade_id = cid.id
ORDER BY func.id ASC;


-- 4. Consultar todas as ordens de serviço detalhando os equipamentos e funcionários vinculados
SELECT 
    serv.id AS servico_id,
    serv.descricao AS servico_descricao,
    serv.data_inicio,
    serv.status AS servico_status,
    eq.nome AS equipamento_nome,
    eq.patrimonio AS equipamento_patrimonio,
    func.nome AS funcionario_nome
FROM min_servicos serv
LEFT JOIN min_equipamentos eq ON serv.equipamento_id = eq.id
LEFT JOIN min_funcionarios func ON serv.funcionario_id = func.id
ORDER BY serv.id ASC;
