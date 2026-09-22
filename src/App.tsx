/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DashboardRole, StudentAssessedSkill, OnGroundParityReport } from './types';
import { ON_GROUND_PARITY_REPORTS, DISTRICT_MARKET_DATA } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StudentDashboard } from './components/student/StudentDashboard';
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { GovernmentDashboard } from './components/government/GovernmentDashboard';

export default function App() {
  const [currentRole, setCurrentRole] = useState<DashboardRole>('student');

  // Pre-seed Python at 60% as explicitly requested in the problem statement
  const [assessedSkills, setAssessedSkills] = useState<StudentAssessedSkill[]>([
    {
      skillId: 'python',
      skillName: 'Python',
      score: 60,
      level: 'Intermediate',
      assessedAt: new Date().toISOString(),
    },
  ]);

  const [parityReports, setParityReports] = useState<OnGroundParityReport[]>(
    ON_GROUND_PARITY_REPORTS
  );

  const handleAddParityReport = (newReport: OnGroundParityReport) => {
    setParityReports((prev) => [newReport, ...prev]);
  };

  const handleVoteReport = (id: string) => {
    setParityReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, votesAgree: r.votesAgree + 1 } : r))
    );
  };

  // Count uncovered gaps across districts for badge
  const totalUncoveredGaps = DISTRICT_MARKET_DATA[0].topInDemandSkills.filter(
    (s) => !s.hasCoveringCourse
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] flex flex-col font-sans selection:bg-[#1E3A8A] selection:text-[#FFFFFF]">
      {/* Navigation Header */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        studentSkillCount={assessedSkills.length}
        uncoveredGapCount={totalUncoveredGaps}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prominent Contrasting Hero Banner with Big Bold Headline & Dark Tone Switchers */}
        <HeroBanner
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          studentSkillCount={assessedSkills.length}
          uncoveredGapCount={totalUncoveredGaps}
          parityReportCount={parityReports.length}
        />

        {/* Selected Dashboard Workspace */}
        {currentRole === 'student' && (
          <StudentDashboard
            assessedSkills={assessedSkills}
            onUpdateAssessedSkills={setAssessedSkills}
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
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#DED8CE] bg-[#FFFDFC] py-6 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="tracking-wide">
            <span className="font-serif font-semibold text-[#0F172A]">SkillSync</span> — Grounding educational curriculum in real industry demand and regional employment data.
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
    </div>
  );
}
