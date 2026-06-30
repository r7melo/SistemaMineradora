import React, { useState, useEffect } from 'react';
import { cidadeService } from '../services/api';

export default function Cidades() {
  const [cidades, setCidades] = useState([]);
  const [nome, setNome] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    carregarCidades();
  }, []);

  const carregarCidades = async () => {
    setLoading(true);
    try {
      const response = await cidadeService.listar();
      setCidades(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar cidades. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome da cidade não pode estar em branco.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await cidadeService.atualizar(editingId, { nome: nome.trim() });
        setSuccess('Cidade atualizada com sucesso!');
      } else {
        await cidadeService.criar({ nome: nome.trim() });
        setSuccess('Cidade cadastrada com sucesso!');
      }
      
      limparFormulario();
      await carregarCidades();
    } catch (err) {
      setError(err.message || 'Erro ao salvar cidade. Verifique se o nome é único.');
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (cidade) => {
    setEditingId(cidade.id);
    setNome(cidade.nome);
    setError(null);
    setSuccess(null);
  };

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta cidade? Todos os funcionários vinculados ficarão sem cidade.')) return;
    
    setLoading(true);
    try {
      await cidadeService.excluir(id);
      setSuccess('Cidade excluída com sucesso!');
      await carregarCidades();
    } catch (err) {
      setError('Erro ao excluir cidade.');
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setEditingId(null);
    setNome('');
    setError(null);
  };

  return (
    <div className="fade-in-up">
      {/* Cabeçalho da Página */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-geo-alt" aria-hidden="true"></i></span>
          <div>
            <p className="eyebrow mb-1">Polos de Operação</p>
            <h1 className="h3 mb-1">Gestão de Cidades</h1>
            <p className="text-muted mb-0">Cadastre e organize as regiões e polos de operação da mineradora.</p>
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
                <span>{editingId ? 'Editar Cidade' : 'Nova Cidade'}</span>
              </h2>
            </div>

            <div className="mb-4">
              <label className="form-label">Nome da Cidade *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Belo Horizonte" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
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

        {/* Tabela de Cidades (Direita) */}
        <div className="col-12 col-lg-8">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table"></i>
                  <span>Cidades Cadastradas</span>
                </h2>
                <p className="text-muted mb-0">Polos operacionais ativos configurados no sistema.</p>
              </div>
            </div>

            <div className="table-responsive">
              {loading && cidades.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Buscando...</span>
                  </div>
                  <p className="text-muted mt-2">Buscando cidades...</p>
                </div>
              ) : cidades.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-info-circle" style={{ fontSize: '32px' }}></i>
                  <p className="mt-2">Nenhuma cidade cadastrada no momento.</p>
                </div>
              ) : (
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>ID</th>
                      <th>Nome da Cidade</th>
                      <th style={{ width: '120px' }} className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cidades.map((cidade) => (
                      <tr key={cidade.id}>
                        <td>#{cidade.id}</td>
                        <td className="fw-semibold text-body">{cidade.nome}</td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <button 
                              type="button" 
                              className="btn btn-light btn-sm" 
                              onClick={() => iniciarEdicao(cidade)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-light btn-sm text-danger" 
                              onClick={() => excluir(cidade.id)}
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
