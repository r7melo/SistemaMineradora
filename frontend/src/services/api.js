const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // For DELETE or empty responses, we might not have JSON content
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || data.error || `Erro HTTP: ${response.status}`);
    }

    // Standardize to match controller output
    return { data };
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error);
    throw error;
  }
}

export const cidadeService = {
  listar: () => apiCall('/cidades'),
  buscarPorId: (id) => apiCall(`/cidades/${id}`),
  criar: (dados) => apiCall('/cidades', { method: 'POST', body: dados }),
  atualizar: (id, dados) => apiCall(`/cidades/${id}`, { method: 'PUT', body: dados }),
  excluir: (id) => apiCall(`/cidades/${id}`, { method: 'DELETE' }),
};

export const equipamentoService = {
  listar: () => apiCall('/equipamentos'),
  buscarPorId: (id) => apiCall(`/equipamentos/${id}`),
  criar: (dados) => apiCall('/equipamentos', { method: 'POST', body: dados }),
  atualizar: (id, dados) => apiCall(`/equipamentos/${id}`, { method: 'PUT', body: dados }),
  excluir: (id) => apiCall(`/equipamentos/${id}`, { method: 'DELETE' }),
};

export const funcionarioService = {
  listar: () => apiCall('/funcionarios'),
  buscarPorId: (id) => apiCall(`/funcionarios/${id}`),
  criar: (dados) => apiCall('/funcionarios', { method: 'POST', body: dados }),
  atualizar: (id, dados) => apiCall(`/funcionarios/${id}`, { method: 'PUT', body: dados }),
  excluir: (id) => apiCall(`/funcionarios/${id}`, { method: 'DELETE' }),
};

export const servicoService = {
  listar: () => apiCall('/servicos'),
  buscarPorId: (id) => apiCall(`/servicos/${id}`),
  criar: (dados) => apiCall('/servicos', { method: 'POST', body: dados }),
  atualizar: (id, dados) => apiCall(`/servicos/${id}`, { method: 'PUT', body: dados }),
  excluir: (id) => apiCall(`/servicos/${id}`, { method: 'DELETE' }),
};

export const statusService = {
  obterStatus: () => apiCall('/status'),
};
