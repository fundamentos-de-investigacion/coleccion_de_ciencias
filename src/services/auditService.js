import { supabase } from '../api/supabase';

class AuditService {
  /**
   * Log changes to a specimen
   */
  async logChange(specimenId, changes, reason = '') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const logs = Object.keys(changes).map(field => ({
      specimen_id: specimenId,
      user_id: user.id,
      user_email: user.email,
      field_name: field,
      old_value: String(changes[field].old),
      new_value: String(changes[field].new),
      reason
    }));

    if (logs.length === 0) return;

    const { error } = await supabase
      .from('audit_logs')
      .insert(logs);

    if (error) {
      console.error('Error recording audit logic:', error);
    }
  }

  /**
   * Get all changes for a specific specimen
   */
  async getBySpecimen(specimenId) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('specimen_id', specimenId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
    return data;
  }
}

export default new AuditService();
