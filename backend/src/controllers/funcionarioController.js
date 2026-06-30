import supabase from '../config/supabaseClient.js';

export const getAllFuncionarios = async (req, res) => {
  try {
    // Select all fields from min_funcionarios and join the associated cities
    const { data, error } = await supabase
      .from('min_funcionarios')
      .select('*, cidades:min_cidades(nome)')
      .order('id', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFuncionarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('min_funcionarios')
      .select('*, cidades:min_cidades(nome)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Funcionário não encontrado.' });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFuncionario = async (req, res) => {
  try {
    const { nome, cargo, cidade_id } = req.body;
    if (!nome || !cargo) {
      return res.status(400).json({ message: 'Os campos nome e cargo são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('min_funcionarios')
      .insert([{ nome, cargo, cidade_id: cidade_id || null }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cargo, cidade_id } = req.body;

    const { data, error } = await supabase
      .from('min_funcionarios')
      .update({ nome, cargo, cidade_id: cidade_id || null })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('min_funcionarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Funcionário excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
