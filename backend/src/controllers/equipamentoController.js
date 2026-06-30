import supabase from '../config/supabaseClient.js';

export const getAllEquipamentos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('min_equipamentos')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEquipamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('min_equipamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Equipamento não encontrado.' });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEquipamento = async (req, res) => {
  try {
    const { nome, patrimonio, setor, status } = req.body;
    if (!nome || !patrimonio || !setor) {
      return res.status(400).json({ message: 'Campos nome, patrimonio e setor são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('min_equipamentos')
      .insert([{ nome, patrimonio, setor, status: status || 'Disponível' }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, patrimonio, setor, status } = req.body;

    const { data, error } = await supabase
      .from('min_equipamentos')
      .update({ nome, patrimonio, setor, status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('min_equipamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Equipamento excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
