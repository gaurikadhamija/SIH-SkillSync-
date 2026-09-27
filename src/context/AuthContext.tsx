import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, DEMO_USERS } from '../lib/firebase';
import { getUserProfile, setUserProfile, seedInitialFirestoreData } from '../services/firestoreService';
import { DashboardRole, UserProfile } from '../types';

export const isEmailGovernmentAuthorized = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return (
    normalized.endsWith('@workforce.gov.in') ||
    normalized.endsWith('.gov.in') ||
    normalized.endsWith('.gov') ||
    normalized.endsWith('.nic.in') ||
    normalized === 'dr.menon@workforce.gov.in'
  );
};

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
  isGovernmentAuthorized: () => boolean;
  getIdToken: () => Promise<string | null>;
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
            let savedRole = (localStorage.getItem('skillsync_user_role') as DashboardRole) || 'student';
            // Security check: Government role cannot be claimed via localStorage
            if (savedRole === 'government' && !isEmailGovernmentAuthorized(fbUser.email)) {
              savedRole = 'student';
              localStorage.setItem('skillsync_user_role', 'student');
            }

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
          } else {
            // Verify if stored role is government, check email authorization
            if (profile.role === 'government' && !isEmailGovernmentAuthorized(profile.email)) {
              profile.role = 'student';
              await setUserProfile(profile);
            }
          }
          setCurrentUser(profile);
          setRoleState(profile.role);
          localStorage.setItem('skillsync_user_role', profile.role);
        } catch (err) {
          console.error('[AuthContext] Error loading user profile:', err);
        }
      } else {
        setFirebaseUser(null);
        let storedRole = (localStorage.getItem('skillsync_user_role') as DashboardRole) || 'student';
        if (storedRole === 'government') {
          storedRole = 'student';
          localStorage.setItem('skillsync_user_role', 'student');
        }
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
        let roleToAssign = existingProfile ? existingProfile.role : preferredRole;

        // Security check: Government role requires verified government email
        if (roleToAssign === 'government' && !isEmailGovernmentAuthorized(result.user.email)) {
          roleToAssign = 'student';
          setAuthError('Government role requires a verified government domain email (@workforce.gov.in / .gov.in). Assigned Student role.');
        }

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

      const demoConfig = DEMO_USERS[role];

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

      const profile: UserProfile = {
        uid,
        email: demoConfig.email,
        displayName: demoConfig.name,
        role,
        organization: demoConfig.defaultOrg,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('skillsync_user_role', role);
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
      setRoleState('student');
    } catch (err) {
      console.error('[AuthContext] Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentRole = async (role: DashboardRole) => {
    if (role === 'government') {
      const isGov = isEmailGovernmentAuthorized(currentUser?.email || firebaseUser?.email);
      if (!isGov) {
        setAuthError('Government Clearance Required: You cannot switch to the Government role without an official government email domain (@workforce.gov.in / .gov.in).');
        return;
      }
    }

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

  const canAccessRole = (targetRole: DashboardRole): boolean => {
    if (!currentUser) return targetRole === 'student';

    const userRole = currentUser.role;

    if (userRole === 'government') {
      return true; // Government has macro auditing rights
    }

    if (userRole === 'employer') {
      return targetRole === 'employer' || targetRole === 'student';
    }

    if (userRole === 'student') {
      return targetRole === 'student'; // Strictly student-only
    }

    return false;
  };

  const isGovernmentAuthorized = (): boolean => {
    return isEmailGovernmentAuthorized(currentUser?.email || firebaseUser?.email);
  };

  const getIdToken = async (): Promise<string | null> => {
    if (auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken();
      } catch (e) {
        console.warn('[AuthContext] Note on Firebase ID token retrieval:', e);
      }
    }
    if (currentRole === 'government') {
      return 'demo-government-token';
    }
    if (currentRole === 'employer') {
      return 'demo-employer-token';
    }
    return 'demo-student-token';
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
        isGovernmentAuthorized,
        getIdToken,
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
