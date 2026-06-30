import supabase from '../config/supabaseClient.js';

export const getAllServicos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('min_servicos')
      .select('*, equipamentos:min_equipamentos(nome, patrimonio), funcionarios:min_funcionarios(nome)')
      .order('id', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServicoById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('min_servicos')
      .select('*, equipamentos:min_equipamentos(nome, patrimonio), funcionarios:min_funcionarios(nome)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Serviço não encontrado.' });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createServico = async (req, res) => {
  try {
    const { descricao, equipamento_id, funcionario_id, status } = req.body;
    if (!descricao || !equipamento_id) {
      return res.status(400).json({ message: 'Os campos descricao e equipamento_id são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('min_servicos')
      .insert([{
        descricao,
        equipamento_id,
        funcionario_id: funcionario_id || null,
        status: status || 'Pendente'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, equipamento_id, funcionario_id, status } = req.body;

    const { data, error } = await supabase
      .from('min_servicos')
      .update({
        descricao,
        equipamento_id,
        funcionario_id: funcionario_id || null,
        status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('min_servicos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Serviço excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
