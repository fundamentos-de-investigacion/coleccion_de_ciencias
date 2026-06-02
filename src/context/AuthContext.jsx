import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../api/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  const fetchRole = async (userId) => {
    if (!userId) {
      setUserRole(null);
      setUserPermissions({});
      return;
    }
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, permissions')
        .eq('user_id', userId)
        .single();
      
      if (data && !error) {
        setUserRole(data.role);
        setUserPermissions(data.permissions || {});
      } else {
        setUserRole('auxiliar');
        setUserPermissions({});
      }
    } catch {
      setUserRole('auxiliar');
      setUserPermissions({});
    }
  };

  const finishLoading = () => {
    if (loadingRef.current) {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // Failsafe to ensure the app ALWAYS renders eventually
    const failsafeTimer = setTimeout(() => {
      if (loading) {
        console.warn('AuthContext timeout reached, forcing load...');
        setLoading(false);
      }
    }, 3000);

    try {
      // Get initial session
      supabase.auth.getSession().then(async (response) => {
        try {
          const { data, error } = response || {};
          if (error || !data || !data.session) {
            setSession(null);
            setUser(null);
            setLoading(false);
            return;
          }
          
          const currentSession = data.session;
          setSession(currentSession);
          setUser(currentSession.user ?? null);
          
          if (currentSession.user?.id) {
            await fetchRole(currentSession.user.id);
          }
        } catch (innerErr) {
          console.error('Error procesando session:', innerErr);
        } finally {
          setLoading(false);
        }
      }).catch(err => {
        console.error('Unexpected error in getSession:', err);
        setLoading(false);
      });

      // Listen for changes
      const authListener = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
        try {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (currentSession?.user?.id) {
            await fetchRole(currentSession.user.id);
          } else {
            setUserRole(null);
            setUserPermissions({});
          }
        } catch (innerErr) {
          console.error('Error en onAuthStateChange:', innerErr);
        } finally {
          setLoading(false);
        }
      });

      const subscription = authListener?.data?.subscription;

      return () => {
        clearTimeout(failsafeTimer);
        if (subscription) subscription.unsubscribe();
      };
    } catch (criticalErr) {
      console.error('Critical error in AuthContext effect:', criticalErr);
      setLoading(false);
      return () => clearTimeout(failsafeTimer);
    }
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
