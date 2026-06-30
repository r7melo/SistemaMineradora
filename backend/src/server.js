import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import equipamentoRoutes from './routes/equipamentoRoutes.js';
import cidadeRoutes from './routes/cidadeRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import servicoRoutes from './routes/servicoRoutes.js';

import supabase from './config/supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors());

// Middleware para processar JSON
app.use(express.json());

// Rota raiz de status básico
app.get('/', (req, res) => {
  res.json({
    name: 'Sistema Mineradora API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date()
  });
});

// Rota para checagem dinâmica de conexão com o Supabase
app.get('/api/status', async (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.includes('your-project-id') || !supabaseKey || supabaseKey.includes('your-supabase-anon-key')) {
    return res.json({
      status: 'online',
      database: 'NOT_CONFIGURED',
      message: 'Supabase não configurado. Adicione as chaves no arquivo .env.'
    });
  }

  try {
    // Tenta uma consulta rápida
    const { error } = await supabase.from('min_cidades').select('id').limit(1);
    if (error) {
      // Se a tabela não existir, significa que a conexão está autenticada, mas o schema.sql não foi rodado
      if (error.code === 'PGRST116' || error.message.includes('relation "min_cidades" does not exist')) {
        return res.json({
          status: 'online',
          database: 'CONNECTED_NO_TABLES',
          message: 'Conectado ao Supabase, mas tabelas não criadas.'
        });
      }
      throw error;
    }
    res.json({
      status: 'online',
      database: 'OK',
      message: 'Conexão ativa com o Supabase.'
    });
  } catch (error) {
    res.json({
      status: 'online',
      database: 'ERROR',
      message: error.message || 'Erro ao conectar no banco.'
    });
  }
});

// Registrar as rotas da API
app.use('/api/equipamentos', equipamentoRoutes);
app.use('/api/cidades', cidadeRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/servicos', servicoRoutes);

// Middleware global para tratamento de erros
app.use((err, req, res, next) => {
  console.error('🔴 Error Stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno no servidor.'
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
