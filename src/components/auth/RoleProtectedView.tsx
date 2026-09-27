import React from 'react';
import { Lock, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { DashboardRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface RoleProtectedViewProps {
  requiredRole: DashboardRole;
  currentRole: DashboardRole;
  onOpenAuthModal: (roleRequirement: DashboardRole) => void;
}

export const RoleProtectedView: React.FC<RoleProtectedViewProps> = ({
  requiredRole,
  currentRole,
  onOpenAuthModal,
}) => {
  const { signInAsDemoRole } = useAuth();

  const roleLabels: Record<DashboardRole, { title: string; subtitle: string; color: string }> = {
    student: {
      title: 'Student & Candidate Dashboard',
      subtitle: 'Candidate skill testing, career diagnostic & learning paths',
      color: 'blue'
    },
    employer: {
      title: 'Employer Ground-Truth Parity Dashboard',
      subtitle: 'Enterprise candidate audits, discrepancy registry & syllabus defect logs',
      color: 'sky'
    },
    government: {
      title: 'Government Workforce & Curriculum Policy Dashboard',
      subtitle: 'District-level labor demand telemetry, state vocational alignment & patch approvals',
      color: 'amber'
    }
  };

  const req = roleLabels[requiredRole];

  return (
    <div className="bg-[#131D2A] border border-[#223348] rounded-2xl p-8 sm:p-12 text-center text-white max-w-2xl mx-auto my-8 shadow-xl relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-5">
        <Lock className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/20 mb-3">
        <ShieldAlert className="w-3.5 h-3.5" />
        Role-Based Access Control
      </div>

      <h3 className="text-2xl font-serif font-bold text-white mb-2">
        {req.title} Restricted
      </h3>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        Your current active profile is registered as <strong className="text-white uppercase font-bold">{currentRole}</strong>. 
        Access to this operational dashboard requires authorized <strong className="text-white uppercase font-bold">{requiredRole}</strong> credentials.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => signInAsDemoRole(requiredRole)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Switch to Authorized {requiredRole.toUpperCase()} Account</span>
        </button>

        <button
          onClick={() => onOpenAuthModal(requiredRole)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B1320] hover:bg-[#1E2D44] border border-[#223348] text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Sign In with Custom Account</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
