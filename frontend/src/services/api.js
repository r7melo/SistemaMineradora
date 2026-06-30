import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase não configuradas no frontend/.env');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const cidadeService = {
  listar: async () => {
    const { data, error } = await supabase
      .from('min_cidades')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return { data };
  },
  buscarPorId: async (id) => {
    const { data, error } = await supabase
      .from('min_cidades')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data };
  },
  criar: async (dados) => {
    const { data, error } = await supabase
      .from('min_cidades')
      .insert([dados])
      .select()
      .single();
    if (error) throw error;
    return { data };
  },
  atualizar: async (id, dados) => {
    const { data, error } = await supabase
      .from('min_cidades')
      .update(dados)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data };
  },
  excluir: async (id) => {
    const { error } = await supabase
      .from('min_cidades')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { data: {} };
  },
};

export const equipamentoService = {
  listar: async () => {
    const { data, error } = await supabase
      .from('min_equipamentos')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return { data };
  },
  buscarPorId: async (id) => {
    const { data, error } = await supabase
      .from('min_equipamentos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data };
  },
  criar: async (dados) => {
    const { data, error } = await supabase
      .from('min_equipamentos')
      .insert([dados])
      .select()
      .single();
    if (error) throw error;
    return { data };
  },
  atualizar: async (id, dados) => {
    const { data, error } = await supabase
      .from('min_equipamentos')
      .update(dados)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data };
  },
  excluir: async (id) => {
    const { error } = await supabase
      .from('min_equipamentos')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { data: {} };
  },
};

export const funcionarioService = {
  listar: async () => {
    const { data, error } = await supabase
      .from('min_funcionarios')
      .select('*, cidades:min_cidades(nome)')
      .order('id', { ascending: true });
    if (error) throw error;
    return { data };
  },
  buscarPorId: async (id) => {
    const { data, error } = await supabase
      .from('min_funcionarios')
      .select('*, cidades:min_cidades(nome)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data };
  },
  criar: async (dados) => {
    const { data, error } = await supabase
      .from('min_funcionarios')
      .insert([dados])
      .select()
      .single();
    if (error) throw error;
    return { data };
  },
  atualizar: async (id, dados) => {
    const { data, error } = await supabase
      .from('min_funcionarios')
      .update(dados)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data };
  },
  excluir: async (id) => {
    const { error } = await supabase
      .from('min_funcionarios')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { data: {} };
  },
};

export const servicoService = {
  listar: async () => {
    const { data, error } = await supabase
      .from('min_servicos')
      .select('*, equipamentos:min_equipamentos(nome, patrimonio), funcionarios:min_funcionarios(nome)')
      .order('id', { ascending: true });
    if (error) throw error;
    return { data };
  },
  buscarPorId: async (id) => {
    const { data, error } = await supabase
      .from('min_servicos')
      .select('*, equipamentos:min_equipamentos(nome, patrimonio), funcionarios:min_funcionarios(nome)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data };
  },
  criar: async (dados) => {
    const { data, error } = await supabase
      .from('min_servicos')
      .insert([dados])
      .select()
      .single();
    if (error) throw error;
    return { data };
  },
  atualizar: async (id, dados) => {
    const { data, error } = await supabase
      .from('min_servicos')
      .update(dados)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data };
  },
  excluir: async (id) => {
    const { error } = await supabase
      .from('min_servicos')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { data: {} };
  },
};

export const statusService = {
  obterStatus: async () => {
    try {
      const { error } = await supabase
        .from('min_cidades')
        .select('id')
        .limit(1);
      if (error) throw error;
      return { data: { database: 'OK' } };
    } catch (err) {
      return { data: { database: 'ERROR' } };
    }
  },
};
