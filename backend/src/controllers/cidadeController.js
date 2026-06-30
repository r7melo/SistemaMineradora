import supabase from '../config/supabaseClient.js';

export const getAllCidades = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('min_cidades')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCidadeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('min_cidades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Cidade não encontrada.' });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCidade = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ message: 'O campo nome é obrigatório.' });
    }

    const { data, error } = await supabase
      .from('min_cidades')
      .insert([{ nome }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const { data, error } = await supabase
      .from('min_cidades')
      .update({ nome })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('min_cidades')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Cidade excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
