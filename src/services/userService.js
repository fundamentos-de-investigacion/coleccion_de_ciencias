import { supabase } from '../api/supabase';
import { createClient } from '@supabase/supabase-js';

// Cliente secundario para no cerrar la sesión del admin al crear usuarios.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const secondarySupabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  { auth: { persistSession: false } }
);

class UserService {
  /**
   * Obtiene todos los perfiles cruzados (auth.users + user_roles)
   * Requiere rol 'admin'.
   */
  async getAllUsers() {
    const { data, error } = await supabase.rpc('get_user_profiles');
    if (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
    return data;
  }

  /**
   * Crea un usuario usando un cliente secundario, y luego le asigna el rol.
   */
  async createUser(email, password, role, permissions) {
    // 1. Crear el usuario en auth.users (sin desloguear al admin)
    const { data: authData, error: authError } = await secondarySupabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Error al crear cuenta:', authError);
      throw authError;
    }

    const newUserId = authData.user?.id;
    if (!newUserId) throw new Error('No se pudo obtener el ID del nuevo usuario.');

    // 2. Insertar el rol y permisos
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: newUserId, role, permissions });

    if (roleError) {
      console.error('Error al asignar rol:', roleError);
      throw roleError;
    }

    return true;
  }

  /**
   * Actualiza el rol o permisos de un usuario
   */
  async updateUserRole(userId, role, permissions) {
    const { error } = await supabase
      .from('user_roles')
      .update({ role, permissions })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  /**
   * Elimina un usuario completamente de auth.users y (en cascada) de user_roles
   */
  async deleteUser(userId) {
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId });
    if (error) throw error;
    return true;
  }

  /**
   * Cambia la contraseña del usuario actualmente logueado.
   */
  async changePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return data;
  }
}

export default new UserService();
