import { supabase } from '../api/supabase';

class DeterminationService {
  async getBySpecimen(specimenId) {
    const { data, error } = await supabase
      .from('determinations')
      .select('*')
      .eq('specimen_id', specimenId)
      .order('determination_date', { ascending: false });

    if (error) {
      console.error('Error fetching determinations:', error);
      return [];
    }
    return data;
  }

  async addDetermination(determinationData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Use a transaction-like approach to ensure only one is "current"
    if (determinationData.is_current) {
      await supabase
        .from('determinations')
        .update({ is_current: false })
        .eq('specimen_id', determinationData.specimen_id);
    }

    const { data, error } = await supabase
      .from('determinations')
      .insert([{ ...determinationData, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export default new DeterminationService();
