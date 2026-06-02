import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId) => {
    if (!userId) {
      setUserRole(null);
      setUserPermissions({});
      return;
    }
    const { data, error } = await supabase
      .from('user_roles')
      .select('role, permissions')
      .eq('user_id', userId)
      .single();
    
    if (data && !error) {
      setUserRole(data.role);
      setUserPermissions(data.permissions || {});
    } else {
      // Default fallback
      setUserRole('auxiliar');
      setUserPermissions({});
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        await fetchRole(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        await fetchRole(session.user.id);
      } else {
        setUserRole(null);
        setUserPermissions({});
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, userPermissions, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
