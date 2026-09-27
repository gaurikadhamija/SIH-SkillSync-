/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DashboardRole, StudentAssessedSkill, OnGroundParityReport } from './types';
import { DISTRICT_MARKET_DATA, ON_GROUND_PARITY_REPORTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StudentDashboard } from './components/student/StudentDashboard';
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { GovernmentDashboard } from './components/government/GovernmentDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { RoleProtectedView } from './components/auth/RoleProtectedView';
import { useAuth } from './context/AuthContext';
import { 
  subscribeStudentAssessments, 
  saveStudentAssessment,
  subscribeParityReports, 
  addParityReportToDb, 
  voteOnParityReportInDb,
  subscribeDistricts
} from './services/firestoreService';

export default function App() {
  const { currentUser, currentRole, setCurrentRole, canAccessRole } = useAuth();

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [targetRoleRequirement, setTargetRoleRequirement] = useState<DashboardRole | null>(null);

  // Firestore persistent student skills
  const [assessedSkills, setAssessedSkills] = useState<StudentAssessedSkill[]>([
    {
      skillId: 'python',
      skillName: 'Python',
      score: 60,
      level: 'Intermediate',
      assessedAt: new Date().toISOString(),
    },
  ]);

  // Firestore persistent employer parity reports
  const [parityReports, setParityReports] = useState<OnGroundParityReport[]>(
    ON_GROUND_PARITY_REPORTS
  );

  // Persistent districts
  const [districts, setDistricts] = useState(DISTRICT_MARKET_DATA);

  // 1. Subscribe to Student Assessments for Current User in Firestore
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = subscribeStudentAssessments(
      currentUser.uid,
      (skills) => {
        if (skills.length > 0) {
          setAssessedSkills(skills);
        } else {
          // Initialize pre-seeded Python at 60% in Firestore for new student
          const initialSkill: StudentAssessedSkill = {
            skillId: 'python',
            skillName: 'Python',
            score: 60,
            level: 'Intermediate',
            assessedAt: new Date().toISOString(),
          };
          saveStudentAssessment(currentUser.uid, initialSkill);
          setAssessedSkills([initialSkill]);
        }
      },
      (err) => console.warn('[App] Local fallback for student skills:', err)
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // 2. Subscribe to Employer Parity Reports in Firestore
  useEffect(() => {
    const unsubscribe = subscribeParityReports(
      (reports) => {
        if (reports.length > 0) {
          setParityReports(reports);
        }
      },
      (err) => console.warn('[App] Local fallback for parity reports:', err)
    );

    return () => unsubscribe();
  }, []);

  // 3. Subscribe to Districts in Firestore
  useEffect(() => {
    const unsubscribe = subscribeDistricts((liveDistricts) => {
      if (liveDistricts.length > 0) {
        setDistricts(liveDistricts);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle saving new or updated skills to Firestore
  const handleUpdateAssessedSkills = async (newSkills: StudentAssessedSkill[]) => {
    setAssessedSkills(newSkills);
    if (currentUser?.uid) {
      for (const skill of newSkills) {
        await saveStudentAssessment(currentUser.uid, skill);
      }
    }
  };

  // Handle creating parity report in Firestore
  const handleAddParityReport = async (newReport: OnGroundParityReport) => {
    // Optimistic UI update
    setParityReports((prev) => [newReport, ...prev]);

    try {
      await addParityReportToDb(
        {
          employerName: newReport.employerName,
          industry: newReport.industry,
          roleAssessed: newReport.roleAssessed,
          academicSource: newReport.academicSource,
          claimedProficiency: newReport.claimedProficiency,
          actualOnGroundProficiency: newReport.actualOnGroundProficiency,
          observedDeficit: newReport.observedDeficit,
          severity: newReport.severity,
          recommendedCurriculumPatch: newReport.recommendedCurriculumPatch,
        },
        currentUser?.uid
      );
    } catch (err) {
      console.error('[App] Failed to persist parity report to Firestore:', err);
    }
  };

  // Handle voting on parity report in Firestore
  const handleVoteReport = async (id: string) => {
    // Optimistic UI increment
    setParityReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, votesAgree: r.votesAgree + 1 } : r))
    );

    try {
      const voteResult = await voteOnParityReportInDb(id, currentUser?.uid || 'guest-user');
      if (voteResult.alreadyVoted) {
        alert('You have already recorded your verification vote for this report.');
      }
    } catch (err) {
      console.error('[App] Failed to persist report vote to Firestore:', err);
    }
  };

  const openAuthWithRequirement = (roleRequirement?: DashboardRole) => {
    setTargetRoleRequirement(roleRequirement || null);
    setIsAuthModalOpen(true);
  };

  // Count uncovered gaps across districts for badge
  const totalUncoveredGaps = (districts[0]?.topInDemandSkills || []).filter(
    (s) => !s.hasCoveringCourse
  ).length;

  // Check role authorization
  const isAuthorizedForCurrentRole = canAccessRole(currentRole);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] flex flex-col font-sans selection:bg-[#1E3A8A] selection:text-[#FFFFFF]">
      {/* Navigation Header with Auth Indicator */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        studentSkillCount={assessedSkills.length}
        uncoveredGapCount={totalUncoveredGaps}
        onOpenAuthModal={openAuthWithRequirement}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prominent Hero Banner */}
        <HeroBanner
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          studentSkillCount={assessedSkills.length}
          uncoveredGapCount={totalUncoveredGaps}
          parityReportCount={parityReports.length}
        />

        {/* Role Guard: If authorized, display dashboard. If restricted, display RoleProtectedView */}
        {isAuthorizedForCurrentRole ? (
          <>
            {currentRole === 'student' && (
              <StudentDashboard
                assessedSkills={assessedSkills}
                onUpdateAssessedSkills={handleUpdateAssessedSkills}
              />
            )}

            {currentRole === 'employer' && (
              <EmployerDashboard
                parityReports={parityReports}
                onAddParityReport={handleAddParityReport}
                onVoteReport={handleVoteReport}
              />
            )}

            {currentRole === 'government' && <GovernmentDashboard />}
          </>
        ) : (
          <RoleProtectedView
            requiredRole={currentRole}
            currentRole={currentUser?.role || 'student'}
            onOpenAuthModal={openAuthWithRequirement}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#DED8CE] bg-[#FFFDFC] py-6 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="tracking-wide">
            <span className="font-serif font-semibold text-[#0F172A]">SkillSync</span> — Powered by Cloud Firestore &amp; Firebase Authentication. Grounding education in real hiring telemetry.
          </p>
          <div className="flex items-center gap-3 text-[#64748B] font-medium text-[11px]">
            <span>Student Assessment</span>
            <span className="text-[#CBD5E1]">•</span>
            <span>Employer Audit</span>
            <span className="text-[#CBD5E1]">•</span>
            <span>Policy Planning</span>
          </div>
        </div>
      </footer>

      {/* Authentication & Role Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setTargetRoleRequirement(null);
        }}
        targetRoleRequirement={targetRoleRequirement}
      />
    </div>
  );
}
