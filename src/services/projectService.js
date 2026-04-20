import { supabase } from '../api/supabase';

class ProjectService {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data;
  }

  async create(projectData) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...projectData, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id, projectData) {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export default new ProjectService();
