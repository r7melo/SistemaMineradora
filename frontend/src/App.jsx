import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Inicio from './pages/Inicio';
import Equipamentos from './pages/Equipamentos';
import Cidades from './pages/Cidades';
import Funcionarios from './pages/Funcionarios';
import Servicos from './pages/Servicos';

import { statusService } from './services/api';

export default function App() {
  const [pagina, setPagina] = useState('inicio');
  const [dbStatus, setDbStatus] = useState('CHECKING'); // 'OK', 'ERROR', 'NOT_CONFIGURED', 'CONNECTED_NO_TABLES', 'CHECKING'
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado de expansão do menu lateral

  // Forçar tema escuro (dark theme) nativo do template
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }, []);

  // Monitorar status do Supabase
  useEffect(() => {
    async function verifyDb() {
      try {
        const response = await statusService.obterStatus();
        setDbStatus(response.data.database);
      } catch (err) {
        setDbStatus('ERROR');
      }
    }
    verifyDb();
    const interval = setInterval(verifyDb, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  // Largura definida pelo estado de colapso
  const sidebarWidth = isCollapsed ? 84 : 260;

  const renderPage = () => {
    switch (pagina) {
      case 'inicio':
        return <Inicio />;
      case 'equipamentos':
        return <Equipamentos />;
      case 'cidades':
        return <Cidades />;
      case 'funcionarios':
        return <Funcionarios />;
      case 'servicos':
        return <Servicos />;
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="admin-shell">
      {/* Menu / Sidebar Lateral Colapsável */}
      <Menu 
        pagina={pagina} 
        setPagina={setPagina} 
        dbStatus={dbStatus} 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        sidebarWidth={sidebarWidth}
      />

      <div 
        className="admin-main" 
        style={{ 
          marginLeft: `${sidebarWidth}px`, 
          transition: 'margin-left 0.2s ease-in-out' // Transição suave ao expandir/contrair
        }}
      >
        {/* Conteúdo Dinâmico da Página */}
        <main className="dashboard-content">
          <div className="container-fluid px-3 px-lg-4 py-4">
            {renderPage()}
          </div>
        </main>

        {/* Rodapé do Template */}
        <footer className="admin-footer">
          <div className="container-fluid px-3 px-lg-4 d-flex justify-content-between align-items-center flex-wrap">
            <span>
              &copy; {new Date().getFullYear()} <strong>Mineradora Geral S.A.</strong> • Sistema de Gestão de Minas.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
