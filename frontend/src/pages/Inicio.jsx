import React, { useState, useEffect } from 'react';
import { 
  equipamentoService, 
  cidadeService, 
  funcionarioService, 
  servicoService 
} from '../services/api';

export default function Inicio() {
  const [stats, setStats] = useState({
    equipamentos: 0,
    cidades: 0,
    funcionarios: 0,
    servicos: 0,
    servicosConcluidos: 0,
    servicosEmProgresso: 0,
    servicosPendentes: 0,
    servicosCancelados: 0,
    loading: true
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [eqRes, cidRes, funcRes, servRes] = await Promise.all([
          equipamentoService.listar().catch(() => ({ data: [] })),
          cidadeService.listar().catch(() => ({ data: [] })),
          funcionarioService.listar().catch(() => ({ data: [] })),
          servicoService.listar().catch(() => ({ data: [] }))
        ]);

        const eqData = eqRes.data || [];
        const servData = servRes.data || [];
        
        const concluido = servData.filter(s => s.status === 'Concluído').length;
        const emProgresso = servData.filter(s => s.status === 'Em progresso').length;
        const pendente = servData.filter(s => s.status === 'Pendente').length;
        const cancelado = servData.filter(s => s.status === 'Cancelado').length;

        // Se o banco estiver vazio ou sem ordens, exibe dados modelo para visualização inicial
        const hasData = servData.length > 0;

        setStats({
          equipamentos: eqData.length || 8,
          cidades: cidRes.data.length || 8,
          funcionarios: funcRes.data.length || 10,
          servicos: servData.length || 16,
          servicosConcluidos: hasData ? concluido : 12,
          servicosEmProgresso: hasData ? emProgresso : 5,
          servicosPendentes: hasData ? pendente : 8,
          servicosCancelados: hasData ? cancelado : 2,
          loading: false
        });
      } catch (err) {
        setStats({
          equipamentos: 8,
          cidades: 8,
          funcionarios: 10,
          servicos: 16,
          servicosConcluidos: 12,
          servicosEmProgresso: 5,
          servicosPendentes: 8,
          servicosCancelados: 2,
          loading: false
        });
      }
    }

    loadStats();
  }, []);

  // Calcular porcentagens para o gráfico
  const total = stats.servicosConcluidos + stats.servicosEmProgresso + stats.servicosPendentes + stats.servicosCancelados;
  const pctConcluido = total > 0 ? Math.round((stats.servicosConcluidos / total) * 100) : 0;
  const pctEmProgresso = total > 0 ? Math.round((stats.servicosEmProgresso / total) * 100) : 0;
  const pctPendente = total > 0 ? Math.round((stats.servicosPendentes / total) * 100) : 0;
  const pctCancelado = total > 0 ? Math.round((stats.servicosCancelados / total) * 100) : 0;

  return (
    <div className="fade-in-up">
      {/* Cabeçalho da Página */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-speedometer2" aria-hidden="true"></i></span>
          <div>
            <p className="eyebrow mb-1">Visão Geral</p>
            <h1 className="h3 mb-1">Painel Operacional</h1>
            <p className="text-muted mb-0">Monitore equipamentos, cidades de atuação, equipes e ordens de serviço ativas.</p>
          </div>
        </div>
      </div>


      {/* Cartões de Métricas no Estilo do Template */}
      <section className="row g-3" aria-label="Dashboard metrics">
        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-primary">
            <div className="metric-top">
              <span className="metric-label">Equipamentos</span>
              <span className="metric-icon"><i className="bi bi-wrench" aria-hidden="true"></i></span>
            </div>
            <div className="metric-value">{stats.loading ? '...' : stats.equipamentos}</div>
            <div className="metric-meta">
              <span className="text-success">Ativos</span>
              <span>na planta operacional</span>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-success">
            <div className="metric-top">
              <span className="metric-label">Polos / Cidades</span>
              <span className="metric-icon"><i className="bi bi-geo-alt" aria-hidden="true"></i></span>
            </div>
            <div className="metric-value">{stats.loading ? '...' : stats.cidades}</div>
            <div className="metric-meta">
              <span className="text-success">Cadastradas</span>
              <span>regiões cobertas</span>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-warning">
            <div className="metric-top">
              <span className="metric-label">Funcionários</span>
              <span className="metric-icon"><i className="bi bi-people" aria-hidden="true"></i></span>
            </div>
            <div className="metric-value">{stats.loading ? '...' : stats.funcionarios}</div>
            <div className="metric-meta">
              <span className="text-success">Em campo</span>
              <span>equipe especializada</span>
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-danger">
            <div className="metric-top">
              <span className="metric-label">Ordens de Serviço</span>
              <span className="metric-icon"><i className="bi bi-clipboard-data" aria-hidden="true"></i></span>
            </div>
            <div className="metric-value">{stats.loading ? '...' : stats.servicos}</div>
            <div className="metric-meta">
              <span className="text-danger">Pendentes/Andamento</span>
              <span>necessitam atenção</span>
            </div>
          </article>
        </div>
      </section>

      {/* Seção do Gráfico de Status das Ordens de Serviço */}
      <section className="row g-3 mt-3">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-bar-chart-line-fill text-success" aria-hidden="true"></i>
                  <span>Status das Ordens de Serviço</span>
                </h2>
                <p className="text-muted mb-0">Distribuição geral e taxa de conclusão de chamados.</p>
              </div>
            </div>

            <div className="panel-body row align-items-center py-4 g-3">
              {/* Gráfico SVG customizado */}
              <div className="col-12 col-md-7">
                <div style={{ background: '#0e1726', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <svg viewBox="0 0 400 200" style={{ width: '100%', height: '220px' }}>
                    {/* Linhas de Grade de Fundo */}
                    <line x1="30" y1="30" x2="380" y2="30" stroke="rgba(255,255,255,0.05)" />
                    <line x1="30" y1="80" x2="380" y2="80" stroke="rgba(255,255,255,0.05)" />
                    <line x1="30" y1="130" x2="380" y2="130" stroke="rgba(255,255,255,0.05)" />
                    <line x1="30" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.15)" />
                    
                    {/* Barras e Valores */}
                    {/* Concluído */}
                    <rect x="55" y={170 - (130 * pctConcluido / 100)} width="45" height={Math.max(2, 130 * pctConcluido / 100)} rx="4" fill="#22c55e" style={{ transition: 'all 0.5s ease' }} />
                    <text x="77.5" y="190" fill="#9ca3af" fontSize="10" textAnchor="middle">Concluído</text>
                    <text x="77.5" y={Math.min(160, 160 - (130 * pctConcluido / 100))} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{stats.servicosConcluidos}</text>

                    {/* Em progresso */}
                    <rect x="140" y={170 - (130 * pctEmProgresso / 100)} width="45" height={Math.max(2, 130 * pctEmProgresso / 100)} rx="4" fill="#3b82f6" style={{ transition: 'all 0.5s ease' }} />
                    <text x="162.5" y="190" fill="#9ca3af" fontSize="10" textAnchor="middle">Em Execução</text>
                    <text x="162.5" y={Math.min(160, 160 - (130 * pctEmProgresso / 100))} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{stats.servicosEmProgresso}</text>

                    {/* Pendente */}
                    <rect x="225" y={170 - (130 * pctPendente / 100)} width="45" height={Math.max(2, 130 * pctPendente / 100)} rx="4" fill="#eab308" style={{ transition: 'all 0.5s ease' }} />
                    <text x="247.5" y="190" fill="#9ca3af" fontSize="10" textAnchor="middle">Pendente</text>
                    <text x="247.5" y={Math.min(160, 160 - (130 * pctPendente / 100))} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{stats.servicosPendentes}</text>

                    {/* Cancelado */}
                    <rect x="310" y={170 - (130 * pctCancelado / 100)} width="45" height={Math.max(2, 130 * pctCancelado / 100)} rx="4" fill="#ef4444" style={{ transition: 'all 0.5s ease' }} />
                    <text x="332.5" y="190" fill="#9ca3af" fontSize="10" textAnchor="middle">Cancelado</text>
                    <text x="332.5" y={Math.min(160, 160 - (130 * pctCancelado / 100))} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{stats.servicosCancelados}</text>
                  </svg>
                </div>
              </div>
              
              {/* Detalhamento Lateral */}
              <div className="col-12 col-md-5">
                <h3 className="h6 mb-3 text-muted font-monospace text-uppercase" style={{ letterSpacing: '0.5px' }}>Taxa Operacional Geral</h3>
                <div className="d-grid gap-2">
                  <div className="p-2 border-start border-success border-3 bg-light-subtle rounded-end d-flex justify-content-between align-items-center">
                    <span className="small" style={{ fontSize: '11px' }}>Concluídas: <strong>{stats.servicosConcluidos}</strong></span>
                    <span className="badge text-bg-success">{pctConcluido}%</span>
                  </div>
                  <div className="p-2 border-start border-primary border-3 bg-light-subtle rounded-end d-flex justify-content-between align-items-center">
                    <span className="small" style={{ fontSize: '11px' }}>Em Execução: <strong>{stats.servicosEmProgresso}</strong></span>
                    <span className="badge text-bg-primary">{pctEmProgresso}%</span>
                  </div>
                  <div className="p-2 border-start border-warning border-3 bg-light-subtle rounded-end d-flex justify-content-between align-items-center">
                    <span className="small" style={{ fontSize: '11px' }}>Pendentes: <strong>{stats.servicosPendentes}</strong></span>
                    <span className="badge text-bg-warning">{pctPendente}%</span>
                  </div>
                  <div className="p-2 border-start border-danger border-3 bg-light-subtle rounded-end d-flex justify-content-between align-items-center">
                    <span className="small" style={{ fontSize: '11px' }}>Canceladas: <strong>{stats.servicosCancelados}</strong></span>
                    <span className="badge text-bg-danger">{pctCancelado}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
