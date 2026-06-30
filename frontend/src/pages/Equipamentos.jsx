import React, { useState, useEffect } from 'react';
import { equipamentoService } from '../services/api';

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [nome, setNome] = useState('');
  const [patrimonio, setPatrimonio] = useState('');
  const [setor, setSetor] = useState('');
  const [status, setStatus] = useState('Disponível');
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const carregarEquipamentos = async () => {
    setLoading(true);
    try {
      const response = await equipamentoService.listar();
      setEquipamentos(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar equipamentos. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!nome || !patrimonio || !setor) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = { nome, patrimonio, setor, status };
      
      if (editingId) {
        await equipamentoService.atualizar(editingId, payload);
        setSuccess('Equipamento atualizado com sucesso!');
      } else {
        await equipamentoService.criar(payload);
        setSuccess('Equipamento cadastrado com sucesso!');
      }
      
      limparFormulario();
      await carregarEquipamentos();
    } catch (err) {
      setError(err.message || 'Erro ao salvar equipamento. Verifique se o patrimônio é único.');
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (eq) => {
    setEditingId(eq.id);
    setNome(eq.nome);
    setPatrimonio(eq.patrimonio);
    setSetor(eq.setor);
    setStatus(eq.status);
    setError(null);
    setSuccess(null);
  };

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este equipamento?')) return;
    
    setLoading(true);
    try {
      await equipamentoService.excluir(id);
      setSuccess('Equipamento excluído com sucesso!');
      await carregarEquipamentos();
    } catch (err) {
      setError('Não foi possível excluir o equipamento. Verifique se ele está vinculado a algum serviço.');
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setEditingId(null);
    setNome('');
    setPatrimonio('');
    setSetor('');
    setStatus('Disponível');
    setError(null);
  };

  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case 'Disponível':
        return <span className="badge text-bg-success">Disponível</span>;
      case 'Em manutenção':
        return <span className="badge text-bg-danger">Manutenção</span>;
      case 'Em uso':
        return <span className="badge text-bg-info">Em Uso</span>;
      case 'Inativo':
      default:
        return <span className="badge text-bg-secondary">Inativo</span>;
    }
  };

  return (
    <div className="fade-in-up">
      {/* Cabeçalho da Página */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-wrench" aria-hidden="true"></i></span>
          <div>
            <p className="eyebrow mb-1">Operações</p>
            <h1 className="h3 mb-1">Gestão de Equipamentos</h1>
            <p className="text-muted mb-0">Controle escavadeiras, perfuratrizes, britadores e caminhões da mina.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <span>{success}</span>
        </div>
      )}

      <div className="row g-4">
        {/* Formulário (Esquerda / Lado) */}
        <div className="col-12 col-lg-4">
          <form onSubmit={salvar} className="panel">
            <div className="panel-header mb-3">
              <h2 className="h5 mb-0 section-title">
                <i className="bi bi-file-earmark-plus"></i>
                <span>{editingId ? 'Editar Equipamento' : 'Novo Equipamento'}</span>
              </h2>
            </div>

            <div className="mb-3">
              <label className="form-label">Nome do Equipamento *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Escavadeira CAT 320" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Código de Patrimônio *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: ESC-001" 
                value={patrimonio}
                onChange={(e) => setPatrimonio(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Setor de Operação *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Extração / Transporte" 
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Status Operacional</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Disponível">Disponível</option>
                <option value="Em uso">Em uso</option>
                <option value="Em manutenção">Em manutenção</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              {editingId && (
                <button type="button" onClick={limparFormulario} className="btn btn-outline-secondary">
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {editingId ? 'Salvar Alterações' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabela de Equipamentos (Direita / Lado) */}
        <div className="col-12 col-lg-8">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table"></i>
                  <span>Equipamentos Cadastrados</span>
                </h2>
                <p className="text-muted mb-0">Listagem de todos os ativos registrados no banco.</p>
              </div>
            </div>

            <div className="table-responsive">
              {loading && equipamentos.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Buscando...</span>
                  </div>
                  <p className="text-muted mt-2">Buscando equipamentos...</p>
                </div>
              ) : equipamentos.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-info-circle" style={{ fontSize: '32px' }}></i>
                  <p className="mt-2">Nenhum equipamento cadastrado no momento.</p>
                </div>
              ) : (
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Nome</th>
                      <th>Patrimônio</th>
                      <th>Setor</th>
                      <th>Status</th>
                      <th style={{ width: '120px' }} className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipamentos.map((eq) => (
                      <tr key={eq.id}>
                        <td>#{eq.id}</td>
                        <td className="fw-semibold text-body">{eq.nome}</td>
                        <td><code>{eq.patrimonio}</code></td>
                        <td>{eq.setor}</td>
                        <td>{getStatusBadge(eq.status)}</td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <button 
                              type="button" 
                              className="btn btn-light btn-sm" 
                              onClick={() => iniciarEdicao(eq)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-light btn-sm text-danger" 
                              onClick={() => excluir(eq.id)}
                              title="Excluir"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
