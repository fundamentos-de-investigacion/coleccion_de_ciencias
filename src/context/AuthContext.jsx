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

  // Effect for handling role fetching when user changes
  useEffect(() => {
    let isMounted = true;
    
    const loadRole = async () => {
      if (user?.id) {
        await fetchRole(user.id);
      } else {
        setUserRole(null);
        setUserPermissions({});
      }
      if (isMounted) {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    loadRole();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    // Failsafe to ensure the app ALWAYS renders eventually
    const failsafeTimer = setTimeout(() => {
      if (loadingRef.current) {
        console.warn('AuthContext timeout reached, forcing load...');
        setLoading(false);
        loadingRef.current = false;
      }
    }, 4000);

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data?.session) {
          setSession(null);
          setUser(null);
          setLoading(false);
          loadingRef.current = false;
          return;
        }
        setSession(data.session);
        setUser(data.session.user);
        // fetchRole will be triggered by the other useEffect
      } catch (err) {
        console.error('Unexpected error in getSession:', err);
        setLoading(false);
        loadingRef.current = false;
      }
    };

    initializeAuth();

    // Listen for changes WITHOUT making async Supabase DB calls inside to avoid deadlock
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      // fetchRole and setLoading(false) are handled by the user?.id useEffect
    });

    return () => {
      clearTimeout(failsafeTimer);
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
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
