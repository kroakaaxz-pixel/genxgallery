import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, onAuthStateChange, getCurrentUser, getProfile } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      if (u) getProfile(u.id).then(setProfile);
      setLoading(false);
    });

    const { data: { subscription } } = onAuthStateChange(async (u) => {
      setUser(u);
      if (u) {
        const p = await getProfile(u.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) { setProfile(null); return; }
    const p = await getProfile(user.id);
    setProfile(p);
  }, [user]);

  const value = useMemo(
    () => ({ user, profile, loading, refreshProfile }),
    [user, profile, loading, refreshProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
