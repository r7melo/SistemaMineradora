-- Script de inserção de dados de teste (Seed/Mock data) completo para o Sistema Mineradora
-- Execute este script APÓS ter rodado o script de criação de tabelas (schema.sql)

-- 1. Cidades (Polos de Atuação da Mineradora em Minas Gerais)
INSERT INTO min_cidades (nome) VALUES 
('Belo Horizonte'),
('Nova Lima'),
('Mariana'),
('Congonhas'),
('Ouro Preto'),
('Sabará'),
('Brumadinho'),
('Itabira')
ON CONFLICT (nome) DO NOTHING;

-- 2. Equipamentos (Frota Ativa da Mineradora com Setores e Status)
INSERT INTO min_equipamentos (nome, patrimonio, setor, status) VALUES
('Escavadeira Caterpillar 320', 'ESC-001', 'Extração', 'Disponível'),
('Caminhão Articulado Volvo A40G', 'CAM-002', 'Transporte', 'Disponível'),
('Britador de Mandíbulas Metso', 'BRI-003', 'Processamento', 'Em manutenção'),
('Perfuratriz Atlas Copco', 'PER-004', 'Perfuração', 'Em uso'),
('Carregadeira de Rodas Komatsu WA500', 'CAR-005', 'Transporte', 'Disponível'),
('Trator de Esteira Caterpillar D8T', 'TRA-006', 'Apoio/Terraplenagem', 'Em uso'),
('Motoniveladora John Deere 670G', 'MOT-007', 'Infraestrutura', 'Disponível'),
('Caminhão Pipa Scania G440', 'PIP-008', 'Apoio/Controle de Poeira', 'Em manutenção')
ON CONFLICT (patrimonio) DO NOTHING;

-- 3. Funcionários (Equipe Operacional vinculada aos polos)
INSERT INTO min_funcionarios (nome, cargo, cidade_id) VALUES
('João Silva', 'Operador de Escavadeira', (SELECT id FROM min_cidades WHERE nome = 'Nova Lima' LIMIT 1)),
('Maria Souza', 'Técnica de Manutenção', (SELECT id FROM min_cidades WHERE nome = 'Belo Horizonte' LIMIT 1)),
('Pedro Santos', 'Engenheiro de Minas', (SELECT id FROM min_cidades WHERE nome = 'Mariana' LIMIT 1)),
('Ana Oliveira', 'Operadora de Britador', (SELECT id FROM min_cidades WHERE nome = 'Congonhas' LIMIT 1)),
('Carlos Rocha', 'Operador de Caminhão Fora de Estrada', (SELECT id FROM min_cidades WHERE nome = 'Brumadinho' LIMIT 1)),
('Lucas Ferreira', 'Mecânico de Equipamentos Pesados', (SELECT id FROM min_cidades WHERE nome = 'Sabará' LIMIT 1)),
('Juliana Costa', 'Operadora de Perfuratriz', (SELECT id FROM min_cidades WHERE nome = 'Itabira' LIMIT 1)),
('Roberto Alves', 'Supervisor de Produção da Mina', (SELECT id FROM min_cidades WHERE nome = 'Ouro Preto' LIMIT 1)),
('Fernanda Lima', 'Auxiliar de Operações', (SELECT id FROM min_cidades WHERE nome = 'Nova Lima' LIMIT 1)),
('Bruno Santos', 'Operador de Trator de Esteira', (SELECT id FROM min_cidades WHERE nome = 'Brumadinho' LIMIT 1));

-- 4. Serviços / Ordens de Serviço (Histórico Operacional Completo com múltiplos status)
INSERT INTO min_servicos (descricao, equipamento_id, funcionario_id, status) VALUES
-- Escavadeira Caterpillar (Alta demanda e usabilidade)
('Substituição dos dentes da caçamba e chapas de desgaste', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'ESC-001' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Maria Souza' LIMIT 1), 
 'Concluído'),
('Escavação e carregamento de minério de ferro na frente de lavra', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'ESC-001' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'João Silva' LIMIT 1), 
 'Concluído'),
('Revisão elétrica completa do painel de controle e fusíveis', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'ESC-001' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Lucas Ferreira' LIMIT 1), 
 'Concluído'),
('Operação de decapeamento de solo orgânico na mina Norte', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'ESC-001' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'João Silva' LIMIT 1), 
 'Pendente'),

-- Britador de Mandíbulas Metso (Média demanda)
('Troca das mandíbulas de britagem e lubrificação das engrenagens', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'BRI-003' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Maria Souza' LIMIT 1), 
 'Concluído'),
('Ajuste fino nas esteiras transportadoras e alinhamento de roletes', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'BRI-003' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Lucas Ferreira' LIMIT 1), 
 'Concluído'),
('Reparo no motor elétrico de acionamento do britador secundário', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'BRI-003' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Maria Souza' LIMIT 1), 
 'Em progresso'),

-- Perfuratriz Atlas Copco (Alta demanda de furos)
('Perfuração de furos de produção para desmonte com explosivos', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'PER-004' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Juliana Costa' LIMIT 1), 
 'Concluído'),
('Substituição das hastes de perfuração e coroa de vídia', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'PER-004' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Lucas Ferreira' LIMIT 1), 
 'Concluído'),
('Alinhamento hidráulico da torre de perfuração na bancada Leste', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'PER-004' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Pedro Santos' LIMIT 1), 
 'Pendente'),

-- Caminhão Articulado Volvo (Transporte)
('Transporte de estéril para a pilha de disposição Leste', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'CAM-002' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Carlos Rocha' LIMIT 1), 
 'Concluído'),

-- Trator de Esteira Caterpillar (Apoio)
('Nivelamento da praça de perfuração e abertura de acessos', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'TRA-006' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Bruno Santos' LIMIT 1), 
 'Concluído'),
('Limpeza de pilhas de minério e suporte no pátio de estocagem', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'TRA-006' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Bruno Santos' LIMIT 1), 
 'Em progresso'),

-- Caminhão Pipa Scania
('Abastecimento de água para aspersão de vias de acesso da lavra', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'PIP-008' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Fernanda Lima' LIMIT 1), 
 'Concluído'),
('Reparo em vazamento na bomba centrífuga de aspersão de poeira', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'PIP-008' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Lucas Ferreira' LIMIT 1), 
 'Em progresso'),

-- Motoniveladora John Deere
('Manutenção e conservação das estradas internas de tráfego pesado', 
 (SELECT id FROM min_equipamentos WHERE patrimonio = 'MOT-007' LIMIT 1), 
 (SELECT id FROM min_funcionarios WHERE nome = 'Roberto Alves' LIMIT 1), 
 'Concluído');
