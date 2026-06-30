import React, { useState, useEffect } from 'react';
import { servicoService, equipamentoService, funcionarioService } from '../services/api';

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  
  const [descricao, setDescricao] = useState('');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [status, setStatus] = useState('Pendente');
  
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
      const [servRes, eqRes, funcRes] = await Promise.all([
        servicoService.listar(),
        equipamentoService.listar(),
        funcionarioService.listar()
      ]);
      setServicos(servRes.data);
      setEquipamentos(eqRes.data);
      setFuncionarios(funcRes.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do servidor. Certifique-se de que o backend está funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!descricao.trim() || !equipamentoId) {
      setError('Descrição e equipamento são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        descricao: descricao.trim(),
        equipamento_id: parseInt(equipamentoId),
        funcionario_id: funcionarioId ? parseInt(funcionarioId) : null,
        status
      };

      if (editingId) {
        await servicoService.atualizar(editingId, payload);
        setSuccess('Ordem de serviço atualizada com sucesso!');
      } else {
        await servicoService.criar(payload);
        setSuccess('Ordem de serviço cadastrada com sucesso!');
      }

      limparFormulario();
      await carregarDados();
    } catch (err) {
      setError(err.message || 'Erro ao salvar ordem de serviço.');
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (serv) => {
    setEditingId(serv.id);
    setDescricao(serv.descricao);
    setEquipamentoId(serv.equipamento_id.toString());
    setFuncionarioId(serv.funcionario_id ? serv.funcionario_id.toString() : '');
    setStatus(serv.status);
    setError(null);
    setSuccess(null);
  };

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) return;

    setLoading(true);
    try {
      await servicoService.excluir(id);
      setSuccess('Ordem de serviço excluída com sucesso!');
      await carregarDados();
    } catch (err) {
      setError('Erro ao excluir ordem de serviço.');
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setEditingId(null);
    setDescricao('');
    setEquipamentoId('');
    setFuncionarioId('');
    setStatus('Pendente');
    setError(null);
  };

  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case 'Concluído':
        return <span className="badge text-bg-success">Concluído</span>;
      case 'Em progresso':
        return <span className="badge text-bg-info">Em Progresso</span>;
      case 'Pendente':
        return <span className="badge text-bg-warning">Pendente</span>;
      case 'Cancelado':
      default:
        return <span className="badge text-bg-danger">Cancelado</span>;
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    try {
      const data = new Date(dataStr);
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dataStr;
    }
  };

  return (
    <div className="fade-in-up">
      {/* Cabeçalho da Página */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-clipboard-data" aria-hidden="true"></i></span>
          <div>
            <p className="eyebrow mb-1">Manutenções & Chamados</p>
            <h1 className="h3 mb-1">Ordens de Serviço</h1>
            <p className="text-muted mb-0">Agende manutenções corretivas/preventivas e atribua colaboradores aos equipamentos.</p>
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
                <span>{editingId ? 'Editar Ordem' : 'Nova Ordem de Serviço'}</span>
              </h2>
            </div>

            <div className="mb-3">
              <label className="form-label">Descrição do Serviço *</label>
              <textarea 
                className="form-control"
                placeholder="Ex: Troca de óleo e filtros hidráulicos" 
                rows="2"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Equipamento Vinculado *</label>
              <select 
                className="form-select"
                value={equipamentoId} 
                onChange={(e) => setEquipamentoId(e.target.value)}
                required
              >
                <option value="">Selecione um equipamento...</option>
                {equipamentos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nome} ({eq.patrimonio})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Funcionário Responsável</label>
              <select 
                className="form-select"
                value={funcionarioId} 
                onChange={(e) => setFuncionarioId(e.target.value)}
              >
                <option value="">Nenhum (Não atribuído)</option>
                {funcionarios.map((func) => (
                  <option key={func.id} value={func.id}>
                    {func.nome} ({func.cargo})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label">Status do Serviço</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pendente">Pendente</option>
                <option value="Em progresso">Em progresso</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              {editingId && (
                <button type="button" onClick={limparFormulario} className="btn btn-outline-secondary">
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {editingId ? 'Salvar Alterações' : 'Criar Ordem'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabela de Ordens de Serviço (Direita) */}
        <div className="col-12 col-lg-8">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table"></i>
                  <span>Fila de Ordens de Serviço</span>
                </h2>
                <p className="text-muted mb-0">Serviços agendados e status de execução.</p>
              </div>
            </div>

            <div className="table-responsive">
              {loading && servicos.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Buscando...</span>
                  </div>
                  <p className="text-muted mt-2">Buscando chamados...</p>
                </div>
              ) : servicos.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-info-circle" style={{ fontSize: '32px' }}></i>
                  <p className="mt-2">Nenhuma ordem de serviço registrada.</p>
                </div>
              ) : (
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Descrição</th>
                      <th>Equipamento</th>
                      <th>Responsável</th>
                      <th>Data Início</th>
                      <th>Status</th>
                      <th style={{ width: '120px' }} className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map((serv) => (
                      <tr key={serv.id}>
                        <td>#{serv.id}</td>
                        <td className="fw-semibold text-body">{serv.descricao}</td>
                        <td>
                          {serv.equipamentos ? (
                            <span className="d-flex align-items-center gap-1 text-primary fw-semibold">
                              <i className="bi bi-wrench"></i>
                              {serv.equipamentos.nome}
                              <code className="ms-1 font-monospace" style={{ fontSize: '11px', padding: '2px 4px' }}>{serv.equipamentos.patrimonio}</code>
                            </span>
                          ) : (
                            <span className="text-danger small">Equipamento excluído</span>
                          )}
                        </td>
                        <td>
                          {serv.funcionarios ? (
                            <span className="d-flex align-items-center gap-1">
                              <i className="bi bi-person text-muted"></i>
                              {serv.funcionarios.nome}
                            </span>
                          ) : (
                            <span className="text-muted small">Não atribuído</span>
                          )}
                        </td>
                        <td>
                          <span className="small text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatarData(serv.data_inicio)}
                          </span>
                        </td>
                        <td>{getStatusBadge(serv.status)}</td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <button 
                              type="button" 
                              className="btn btn-light btn-sm" 
                              onClick={() => iniciarEdicao(serv)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-light btn-sm text-danger" 
                              onClick={() => excluir(serv.id)}
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
