import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInAnonymously,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, DEMO_USERS } from '../lib/firebase';
import { getUserProfile, setUserProfile, seedInitialFirestoreData } from '../services/firestoreService';
import { DashboardRole, UserProfile } from '../types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: UserProfile | null;
  currentRole: DashboardRole;
  loading: boolean;
  signInWithGoogle: (preferredRole?: DashboardRole) => Promise<void>;
  signInAsDemoRole: (role: DashboardRole) => Promise<void>;
  signOutUser: () => Promise<void>;
  setCurrentRole: (role: DashboardRole) => Promise<void>;
  canAccessRole: (role: DashboardRole) => boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentRole, setRoleState] = useState<DashboardRole>('student');
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize and seed initial data once
  useEffect(() => {
    seedInitialFirestoreData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          let profile = await getUserProfile(fbUser.uid);
          if (!profile) {
            // New user, create initial profile
            const savedRole = (localStorage.getItem('skillsync_user_role') as DashboardRole) || 'student';
            profile = {
              uid: fbUser.uid,
              email: fbUser.email || `${fbUser.uid.slice(0, 8)}@user.skillsync.edu`,
              displayName: fbUser.displayName || 'SkillSync Member',
              photoURL: fbUser.photoURL || undefined,
              role: savedRole,
              organization: savedRole === 'student' ? 'Technical College' : savedRole === 'employer' ? 'Tech Enterprise' : 'Workforce Ministry',
              createdAt: new Date().toISOString()
            };
            await setUserProfile(profile);
          }
          setCurrentUser(profile);
          setRoleState(profile.role);
          localStorage.setItem('skillsync_user_role', profile.role);
        } catch (err) {
          console.error('[AuthContext] Error loading user profile:', err);
        }
      } else {
        setFirebaseUser(null);
        // Fallback default demo student if not logged in
        const storedRole = (localStorage.getItem('skillsync_user_role') as DashboardRole) || 'student';
        setRoleState(storedRole);
        const demoUser = DEMO_USERS[storedRole];
        setCurrentUser({
          uid: `demo-${storedRole}`,
          email: demoUser.email,
          displayName: demoUser.name,
          role: storedRole,
          organization: demoUser.defaultOrg,
          createdAt: new Date().toISOString()
        });

        // Ensure active Firebase Auth session for persistent Firestore operations
        signInAnonymously(auth).catch((err) => {
          console.warn('[AuthContext] Automatic anonymous sign-in:', err);
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (preferredRole: DashboardRole = 'student') => {
    try {
      setAuthError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const existingProfile = await getUserProfile(result.user.uid);
        const roleToAssign = existingProfile ? existingProfile.role : preferredRole;
        const profile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Google User',
          photoURL: result.user.photoURL || undefined,
          role: roleToAssign,
          organization: DEMO_USERS[roleToAssign].defaultOrg,
          createdAt: existingProfile?.createdAt || new Date().toISOString()
        };
        await setUserProfile(profile);
        setCurrentUser(profile);
        setRoleState(roleToAssign);
        localStorage.setItem('skillsync_user_role', roleToAssign);
      }
    } catch (err: unknown) {
      console.error('[AuthContext] Google Sign-In error:', err);
      const message = err instanceof Error ? err.message : 'Google sign-in was interrupted';
      // If popup was blocked or iframe restriction
      if (message.includes('popup') || message.includes('cancelled') || message.includes('blocked')) {
        setAuthError('Google sign-in popup was blocked or closed. You can also sign in instantly using the demo credentials below.');
      } else {
        setAuthError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInAsDemoRole = async (role: DashboardRole) => {
    try {
      setAuthError(null);
      setLoading(true);
      localStorage.setItem('skillsync_user_role', role);

      // Sign in anonymously to get a genuine Firebase Auth session
      let uid = `demo-${role}`;
      try {
        if (!auth.currentUser) {
          const anonCred = await signInAnonymously(auth);
          uid = anonCred.user.uid;
        } else {
          uid = auth.currentUser.uid;
        }
      } catch (authErr) {
        console.warn('[AuthContext] Anonymous auth fallback:', authErr);
      }

      const demoConfig = DEMO_USERS[role];
      const profile: UserProfile = {
        uid,
        email: demoConfig.email,
        displayName: demoConfig.name,
        role,
        organization: demoConfig.defaultOrg,
        createdAt: new Date().toISOString()
      };

      await setUserProfile(profile);
      setCurrentUser(profile);
      setRoleState(role);
    } catch (err: unknown) {
      console.error('[AuthContext] Error signing in as demo role:', err);
      setAuthError('Failed to switch role profile.');
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setFirebaseUser(null);
      setCurrentUser(null);
      localStorage.removeItem('skillsync_user_role');
      // Reset to default student role
      setRoleState('student');
    } catch (err) {
      console.error('[AuthContext] Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentRole = async (role: DashboardRole) => {
    setRoleState(role);
    localStorage.setItem('skillsync_user_role', role);
    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        role,
        organization: DEMO_USERS[role].defaultOrg
      };
      setCurrentUser(updated);
      try {
        await setUserProfile(updated);
      } catch (e) {
        console.warn('[AuthContext] Failed to persist updated role to Firestore:', e);
      }
    }
  };

  // Role Protection Logic:
  // - Students cannot access Employer or Government dashboards
  // - Employers cannot access Government dashboard
  // - Government can access all dashboards for auditing
  const canAccessRole = (targetRole: DashboardRole): boolean => {
    if (!currentUser) return targetRole === 'student';

    const userRole = currentUser.role;

    if (userRole === 'government') {
      return true; // Government has macro auditing rights
    }

    if (userRole === 'employer') {
      return targetRole === 'employer' || targetRole === 'student'; // Can review student tests & employer parity
    }

    if (userRole === 'student') {
      return targetRole === 'student'; // Strictly student-only
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUser,
        currentRole,
        loading,
        signInWithGoogle,
        signInAsDemoRole,
        signOutUser,
        setCurrentRole,
        canAccessRole,
        authError,
        clearAuthError: () => setAuthError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
