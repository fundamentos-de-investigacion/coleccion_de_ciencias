import { supabase } from '../api/supabase';

class LocationService {
  async getAll() {
    const { data, error } = await supabase
      .from('storage_locations')
      .select('*')
      .order('building', { ascending: true });

    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
    return data;
  }

  async create(locationData) {
    const { data, error } = await supabase
      .from('storage_locations')
      .insert([locationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id, locationData) {
    const { data, error } = await supabase
      .from('storage_locations')
      .update(locationData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export default new LocationService();
