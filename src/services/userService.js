import { supabase } from '../api/supabase';

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
   * Crea un usuario y le asigna el rol.
   */
  async createUser(email, password, role, permissions) {
    // 1. Obtener el token del admin activo para autenticar la Edge Function
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
    console.log('🔑 [DEBUG] sessionErr:', sessionErr);
    console.log('🔑 [DEBUG] session exists:', !!session);
    console.log('🔑 [DEBUG] token (primeros 30):', session?.access_token?.slice(0, 30));
    console.log('🔑 [DEBUG] token expira en (seg):', session?.expires_at ? session.expires_at - Math.floor(Date.now()/1000) : 'N/A');
    if (!session?.access_token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión de nuevo.');
    }

    // 2. Invocar la Edge Function pasando el JWT explícitamente en el header
    console.log('🚀 [DEBUG] Invocando Edge Function create-user...');
    const { data: functionData, error: functionError } = await supabase.functions.invoke('create-user', {
      body: { email, password },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    console.log('📡 [DEBUG] functionData:', functionData);
    console.log('📡 [DEBUG] functionError:', functionError);
    if (functionError) {
      // Leer el cuerpo real de la respuesta del servidor para ver el error exacto
      let serverMessage = null;
      try {
        const errorBody = await functionError.context?.json();
        console.error('📡 [DEBUG] Mensaje exacto del servidor:', errorBody);
        serverMessage = errorBody?.error || null;
      } catch {
        const errorText = await functionError.context?.text?.();
        console.error('📡 [DEBUG] Respuesta cruda del servidor:', errorText);
      }
      console.error('Error al invocar Edge Function:', functionError);

      // Traducir errores conocidos de Supabase a mensajes legibles en español
      if (serverMessage) {
        const msg = serverMessage.toLowerCase();
        if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('duplicate') || msg.includes('already exists')) {
          throw new Error('Este correo electrónico ya está registrado. Por favor usa uno diferente.');
        }
        if (msg.includes('invalid email')) {
          throw new Error('El correo electrónico ingresado no es válido.');
        }
        if (msg.includes('password') && msg.includes('short')) {
          throw new Error('La contraseña es demasiado corta. Debe tener al menos 6 caracteres.');
        }
        if (msg.includes('forbidden') || msg.includes('admin')) {
          throw new Error('No tienes permisos de administrador para crear usuarios.');
        }
        // Si hay un mensaje del servidor pero no coincide con los casos anteriores, mostrarlo directamente
        throw new Error(serverMessage);
      }

      throw new Error('Error al conectar con el servidor. Intenta de nuevo.');
    }


    if (functionData?.error) {
      console.error('Error de la Edge Function:', functionData.error);
      throw new Error(functionData.error);
    }

    const newUserId = functionData?.user?.id;
    if (!newUserId) throw new Error('No se pudo obtener el ID del nuevo usuario desde la Edge Function.');

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
