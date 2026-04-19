import { supabase } from '../api/supabase';

class LoanService {
  async getAll() {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        specimen:specimens(scientificName, kingdom)
      `)
      .order('loan_date', { ascending: false });

    if (error) {
      console.error('Error fetching loans:', error);
      return [];
    }
    return data;
  }

  async getBySpecimen(specimenId) {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('specimen_id', specimenId)
      .order('loan_date', { ascending: false });

    if (error) {
      console.error('Error fetching loans for specimen:', error);
      return [];
    }
    return data;
  }

  async create(loanData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('loans')
      .insert([{
        ...loanData,
        user_id: user?.id,
        status: 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
    return data;
  }

  async markAsReturned(loanId) {
    const { data, error } = await supabase
      .from('loans')
      .update({
        return_date: new Date().toISOString().split('T')[0],
        status: 'returned'
      })
      .eq('id', loanId)
      .select()
      .single();

    if (error) {
      console.error('Error returning loan:', error);
      throw error;
    }
    return data;
  }

  async update(id, loanData) {
    const { data, error } = await supabase
      .from('loans')
      .update(loanData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating loan:', error);
      throw error;
    }
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting loan:', error);
      throw error;
    }
    return true;
  }
}

export default new LoanService();
