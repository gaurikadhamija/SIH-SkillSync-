import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  GraduationCap, 
  Building2, 
  Landmark, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardRole } from '../../types';
import { DEMO_USERS } from '../../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRoleRequirement?: DashboardRole | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  targetRoleRequirement
}) => {
  const { 
    currentUser, 
    currentRole, 
    signInWithGoogle, 
    signInAsDemoRole, 
    signOutUser, 
    loading, 
    authError, 
    clearAuthError 
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState<DashboardRole>(
    targetRoleRequirement || currentRole || 'student'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#131D2A] border border-[#223348] rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
              SkillSync Authentication
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            {targetRoleRequirement 
              ? `${targetRoleRequirement.toUpperCase()} Authorization Required`
              : currentUser 
              ? 'Your SkillSync Account' 
              : 'Sign In to SkillSync'
            }
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {targetRoleRequirement
              ? `You need an authorized ${targetRoleRequirement} profile to access this dashboard. Switch roles or sign in with an approved account below.`
              : 'Sign in to sync your verified skill evaluations, employer parity reports, and workforce policy telemetry across devices.'
            }
          </p>
        </div>

        {/* Error notification if any */}
        {authError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{authError}</span>
            </div>
            <button onClick={clearAuthError} className="text-slate-400 hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {/* Current User Card if Signed In */}
        {currentUser && (
          <div className="mb-6 p-4 rounded-xl bg-[#0B1320] border border-[#223348]">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <div className="text-xs text-slate-500">Currently Active Account</div>
                <div className="font-bold text-white text-sm">{currentUser.displayName}</div>
                <div className="text-xs text-slate-400">{currentUser.email}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                currentUser.role === 'government'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : currentUser.role === 'employer'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {currentUser.role}
              </span>
            </div>

            <div className="text-xs text-slate-400 pt-2 border-t border-[#1E2D44] flex items-center justify-between">
              <span className="truncate">{currentUser.organization}</span>
              <button
                onClick={async () => {
                  await signOutUser();
                  onClose();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold cursor-pointer ml-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-3 mb-6">
          <button
            onClick={async () => {
              await signInWithGoogle(selectedRole);
              onClose();
            }}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-[#223348]"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Or Switch to Role Profile
          </span>
          <div className="flex-grow border-t border-[#223348]"></div>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="space-y-2.5">
          {/* Student Profile Card */}
          <button
            type="button"
            onClick={async () => {
              await signInAsDemoRole('student');
              onClose();
            }}
            className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              currentRole === 'student'
                ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/50'
                : 'border-[#223348] bg-[#0B1320] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Student Profile</span>
                  <span className="text-[10px] text-slate-400 font-normal">({DEMO_USERS.student.name})</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Skill testing, career path, gap bridging &amp; jobs
                </div>
              </div>
            </div>
            {currentRole === 'student' && (
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            )}
          </button>

          {/* Employer Profile Card */}
          <button
            type="button"
            onClick={async () => {
              await signInAsDemoRole('employer');
              onClose();
            }}
            className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              currentRole === 'employer'
                ? 'border-sky-500 bg-sky-950/40 ring-1 ring-sky-500/50'
                : 'border-[#223348] bg-[#0B1320] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Employer Profile</span>
                  <span className="text-[10px] text-slate-400 font-normal">({DEMO_USERS.employer.name})</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  On-ground parity audit, discrepancy registry &amp; voting
                </div>
              </div>
            </div>
            {currentRole === 'employer' && (
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            )}
          </button>

          {/* Government Profile Card */}
          <button
            type="button"
            onClick={async () => {
              await signInAsDemoRole('government');
              onClose();
            }}
            className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              currentRole === 'government'
                ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500/50'
                : 'border-[#223348] bg-[#0B1320] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Government Policy Officer</span>
                  <span className="text-[10px] text-slate-400 font-normal">({DEMO_USERS.government.name})</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  District workforce telemetry &amp; curriculum patch approvals
                </div>
              </div>
            </div>
            {currentRole === 'government' && (
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
