import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // Check active sessions and sets the user safely
        supabase.auth.getSession()
            .then(({ data: { session } = {} }) => {
                if (isMounted) {
                    setUser(session?.user ?? null);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.warn('Auth session check skipped or failed:', err?.message || err);
                if (isMounted) {
                    setUser(null);
                    setLoading(false);
                }
            });

        // Listen for changes on auth state (sign in, sign out, etc.)
        let subscription;
        try {
            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                if (isMounted) {
                    setUser(session?.user ?? null);
                    setLoading(false);
                }
            });
            subscription = data?.subscription;
        } catch (err) {
            console.warn('Auth listener failed to initialize:', err?.message || err);
            if (isMounted) setLoading(false);
        }

        return () => {
            isMounted = false;
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        loading,
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
