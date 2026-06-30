import React from 'react';

export default function Menu({ pagina, setPagina, dbStatus, isCollapsed, toggleSidebar, sidebarWidth }) {
  const menuItems = [
    { id: 'inicio', label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { id: 'equipamentos', label: 'Equipamentos', icon: 'bi bi-wrench' },
    { id: 'cidades', label: 'Cidades', icon: 'bi bi-geo-alt' },
    { id: 'funcionarios', label: 'Funcionários', icon: 'bi bi-people' },
    { id: 'servicos', label: 'Serviços / Ordens', icon: 'bi bi-clipboard-data' },
  ];

  const getDbStatusInfo = () => {
    if (dbStatus === 'OK') {
      return { color: '#22c55e', text: 'Online' };
    }
    return { color: '#ef4444', text: 'Offline' };
  };

  const statusInfo = getDbStatusInfo();  const handleSidebarClick = (e) => {
    // Se o clique foi em um link de navegação, não contrai/expande
    if (e.target.closest('.nav-link')) {
      return;
    }
    toggleSidebar();
  };

  return (
    <aside 
      className="admin-sidebar" 
      id="adminSidebar" 
      aria-label="Main navigation"
      onClick={handleSidebarClick}
      style={{ 
        width: `${sidebarWidth}px`, 
        transition: 'width 0.2s ease-in-out',
        cursor: 'pointer',
        scrollbarGutter: 'unset'
      }}
    >

      <div 
        className="sidebar-header d-flex align-items-center" 
        style={{ 
          padding: isCollapsed ? '1.35rem 0.5rem' : '1.35rem 1.25rem',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <a 
          className="brand-mark" 
          href="#" 
          onClick={(e) => { e.preventDefault(); setPagina('inicio'); }} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
        >
          <span className="brand-icon">
            <i className="bi bi-grid-1x2-fill" style={{ fontSize: '18px' }}></i>
          </span>
          {!isCollapsed && (
            <span className="brand-copy">
              <span className="brand-title" style={{ fontSize: '15px' }}>Mineradora Geral</span>
              <span className="brand-subtitle">Painel de Controle</span>
            </span>
          )}
        </a>
      </div>

      <nav className="sidebar-nav" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {menuItems.map((item) => (
          <a
            key={item.id}
            className={`nav-link ${pagina === item.id ? 'active' : ''}`}
            href="#"
            onClick={(e) => { e.preventDefault(); setPagina(item.id); }}
            style={{ 
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              padding: isCollapsed ? '1rem 0' : '1rem 1.5rem',
              borderRadius: 0,
              margin: 0,
              width: '100%',
              transform: 'none'
            }}
            title={isCollapsed ? item.label : ''}
          >
            <span className="nav-icon" style={{ margin: 0 }}><i className={item.icon} aria-hidden="true"></i></span>
            {!isCollapsed && <span className="nav-text" style={{ marginLeft: '12px' }}>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div 
        className="sidebar-footer" 
        style={{ 
          justifyContent: isCollapsed ? 'center' : 'flex-start', 
          marginInline: isCollapsed ? '0.5rem' : '1.25rem' 
        }}
      >
        <span className="status-dot" style={{ backgroundColor: statusInfo.color }}></span>
        {!isCollapsed && <span className="sidebar-footer-text" style={{ fontSize: '11px', marginLeft: '8px' }}>{statusInfo.text}</span>}
      </div>
    </aside>
  );
}
