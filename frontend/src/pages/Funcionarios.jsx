import React, { useState, useEffect } from 'react';
import { funcionarioService, cidadeService } from '../services/api';

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [cidades, setCidades] = useState([]);
  
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [cidadeId, setCidadeId] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [funcRes, cidRes] = await Promise.all([
        funcionarioService.listar(),
        cidadeService.listar()
      ]);
      setFuncionarios(funcRes.data);
      setCidades(cidRes.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do servidor. Verifique o backend.');
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !cargo.trim()) {
      setError('Nome e cargo são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        nome: nome.trim(),
        cargo: cargo.trim(),
        cidade_id: cidadeId ? parseInt(cidadeId) : null
      };

      if (editingId) {
        await funcionarioService.atualizar(editingId, payload);
        setSuccess('Funcionário atualizado com sucesso!');
      } else {
        await funcionarioService.criar(payload);
        setSuccess('Funcionário cadastrado com sucesso!');
      }

      limparFormulario();
      await carregarDados();
    } catch (err) {
      setError(err.message || 'Erro ao salvar funcionário.');
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (func) => {
    setEditingId(func.id);
    setNome(func.nome);
    setCargo(func.cargo);
    setCidadeId(func.cidade_id ? func.cidade_id.toString() : '');
    setError(null);
    setSuccess(null);
  };

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;

    setLoading(true);
    try {
      await funcionarioService.excluir(id);
      setSuccess('Funcionário excluído com sucesso!');
      await carregarDados();
    } catch (err) {
      setError('Erro ao excluir funcionário. Verifique se ele está vinculado a alguma ordem de serviço.');
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setEditingId(null);
    setNome('');
    setCargo('');
    setCidadeId('');
    setError(null);
  };

  return (
    <div className="fade-in-up">
      {/* Cabeçalho da Página */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-people" aria-hidden="true"></i></span>
          <div>
            <p className="eyebrow mb-1">Recursos Humanos</p>
            <h1 className="h3 mb-1">Gestão de Funcionários</h1>
            <p className="text-muted mb-0">Gerencie engenheiros, operadores, mecânicos e supervisores da equipe.</p>
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
        {/* Formulário (Esquerda) */}
        <div className="col-12 col-lg-4">
          <form onSubmit={salvar} className="panel">
            <div className="panel-header mb-3">
              <h2 className="h5 mb-0 section-title">
                <i className="bi bi-file-earmark-plus"></i>
                <span>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</span>
              </h2>
            </div>

            <div className="mb-3">
              <label className="form-label">Nome do Colaborador *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Ex: João Silva" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Cargo / Função *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Ex: Operador de Máquinas" 
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Cidade / Polo de Atuação</label>
              <select className="form-select" value={cidadeId} onChange={(e) => setCidadeId(e.target.value)}>
                <option value="">Nenhuma / Sem polo fixo</option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
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

        {/* Tabela de Funcionários (Direita) */}
        <div className="col-12 col-lg-8">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table"></i>
                  <span>Funcionários Cadastrados</span>
                </h2>
                <p className="text-muted mb-0">Colaboradores ativos e seus polos vinculados.</p>
              </div>
            </div>

            <div className="table-responsive">
              {loading && funcionarios.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Buscando...</span>
                  </div>
                  <p className="text-muted mt-2">Buscando colaboradores...</p>
                </div>
              ) : funcionarios.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-info-circle" style={{ fontSize: '32px' }}></i>
                  <p className="mt-2">Nenhum funcionário cadastrado no momento.</p>
                </div>
              ) : (
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Nome</th>
                      <th>Cargo</th>
                      <th>Polo / Cidade</th>
                      <th style={{ width: '120px' }} className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funcionarios.map((func) => (
                      <tr key={func.id}>
                        <td>#{func.id}</td>
                        <td className="fw-semibold text-body">{func.nome}</td>
                        <td>
                          <span className="d-flex align-items-center gap-1">
                            <i className="bi bi-briefcase text-muted"></i>
                            {func.cargo}
                          </span>
                        </td>
                        <td>
                          {func.cidades ? (
                            <span className="d-flex align-items-center gap-1 text-primary fw-semibold">
                              <i className="bi bi-geo-alt-fill"></i>
                              {func.cidades.nome}
                            </span>
                          ) : (
                            <span className="text-muted small">Sem polo vinculado</span>
                          )}
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <button 
                              type="button" 
                              className="btn btn-light btn-sm" 
                              onClick={() => iniciarEdicao(func)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-light btn-sm text-danger" 
                              onClick={() => excluir(func.id)}
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
