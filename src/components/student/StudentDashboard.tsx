import React, { useState } from 'react';
import {
  StudentAssessedSkill,
  CareerGoal,
  SkillItem,
  JobOpening,
} from '../../types';
import {
  POPULAR_SKILLS,
  CAREER_GOALS,
  RECOMMENDED_COURSES,
  MOCK_JOB_OPENINGS,
} from '../../data/mockData';
import { SkillAssessmentModal } from './SkillAssessmentModal';
import {
  Sparkles,
  Target,
  BookOpen,
  Briefcase,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

interface StudentDashboardProps {
  assessedSkills: StudentAssessedSkill[];
  onUpdateAssessedSkills: (skills: StudentAssessedSkill[]) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  assessedSkills,
  onUpdateAssessedSkills,
}) => {
  // Goal selection - default to Machine Learning Engineer as asked in prompt
  const [selectedGoalId, setSelectedGoalId] = useState<string>('ml_engineer');
  // Modal state
  const [activeQuizSkill, setActiveQuizSkill] = useState<SkillItem | null>(null);
  // Custom skill input
  const [customSkillName, setCustomSkillName] = useState('');
  const [jobFilter, setJobFilter] = useState<'all' | 'ready' | 'needs_upskill'>('all');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const selectedGoal =
    CAREER_GOALS.find((g) => g.id === selectedGoalId) || CAREER_GOALS[0];

  const handleSaveAssessment = (newAssessed: StudentAssessedSkill) => {
    const existingIndex = assessedSkills.findIndex(
      (s) => s.skillId === newAssessed.skillId || s.skillName.toLowerCase() === newAssessed.skillName.toLowerCase()
    );
    if (existingIndex >= 0) {
      const updated = [...assessedSkills];
      updated[existingIndex] = newAssessed;
      onUpdateAssessedSkills(updated);
    } else {
      onUpdateAssessedSkills([...assessedSkills, newAssessed]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    // Check if it already matches a known skill
    const found = POPULAR_SKILLS.find(
      (s) => s.name.toLowerCase() === customSkillName.trim().toLowerCase()
    );

    if (found) {
      setActiveQuizSkill(found);
    } else {
      // Create quick generic quiz item for custom skill
      const customItem: SkillItem = {
        id: `custom-${Date.now()}`,
        name: customSkillName.trim(),
        category: 'Programming',
        questions: [
          {
            id: 'c-1',
            question: `In professional software development, how do you manage dependencies and versions for ${customSkillName.trim()}?`,
            options: [
              'Manual download into root directory',
              'Using verified package manifests, lockfiles, and virtual environments',
              'Hardcoding versions in comments',
              'Version management is handled automatically by CPU',
            ],
            correctIndex: 1,
            explanation: 'Modern production systems use lockfiles and containerized virtual environments.',
          },
          {
            id: 'c-2',
            question: `What is the recommended approach for testing and error mitigation in ${customSkillName.trim()}?`,
            options: [
              'Relying exclusively on production user reports',
              'Writing automated unit, integration, and regression test suites in CI/CD',
              'Restarting the server every hour',
              'Deleting unhandled exception logs',
            ],
            correctIndex: 1,
            explanation: 'Automated test suites in CI/CD verify code reliability prior to production release.',
          },
        ],
      };
      setActiveQuizSkill(customItem);
    }
    setCustomSkillName('');
  };

  const handleRemoveSkill = (skillId: string) => {
    onUpdateAssessedSkills(assessedSkills.filter((s) => s.skillId !== skillId));
  };

  // Gap Analysis Calculation
  const skillGapBreakdown = selectedGoal.requiredSkills.map((req) => {
    const userSkill = assessedSkills.find(
      (s) => s.skillName.toLowerCase() === req.skillName.toLowerCase()
    );
    const currentScore = userSkill ? userSkill.score : 0;
    const gap = Math.max(0, req.minimumScore - currentScore);
    const isMet = currentScore >= req.minimumScore;

    return {
      skillName: req.skillName,
      importance: req.importance,
      requiredScore: req.minimumScore,
      currentScore,
      gap,
      isMet,
      status: currentScore === 0 ? 'Missing' : isMet ? 'Qualified' : 'Needs Practice',
    };
  });

  // Calculate Overall Career Goal Readiness %
  const totalRequiredPoints = selectedGoal.requiredSkills.reduce(
    (acc, cur) => acc + cur.minimumScore,
    0
  );
  const earnedPoints = selectedGoal.requiredSkills.reduce((acc, req) => {
    const userSkill = assessedSkills.find(
      (s) => s.skillName.toLowerCase() === req.skillName.toLowerCase()
    );
    const score = userSkill ? userSkill.score : 0;
    // Cap at required score for calculation
    return acc + Math.min(score, req.minimumScore);
  }, 0);
  const overallReadiness = Math.round((earnedPoints / (totalRequiredPoints || 1)) * 100);

  // Dynamic Job Match Score Calculation based on current skills
  const calculatedJobs = MOCK_JOB_OPENINGS.map((job) => {
    const matchedCount = job.requiredSkills.reduce((acc, reqSkill) => {
      const userSkill = assessedSkills.find(
        (s) => s.skillName.toLowerCase() === reqSkill.toLowerCase()
      );
      if (userSkill) {
        return acc + userSkill.score / 100;
      }
      return acc;
    }, 0);

    const matchPercent = Math.min(
      98,
      Math.round((matchedCount / job.requiredSkills.length) * 100)
    );

    return {
      ...job,
      matchingScore: matchPercent,
      isReady: matchPercent >= 60,
    };
  }).sort((a, b) => (b.matchingScore || 0) - (a.matchingScore || 0));

  const filteredJobs = calculatedJobs.filter((job) => {
    if (jobFilter === 'ready') return job.isReady;
    if (jobFilter === 'needs_upskill') return !job.isReady;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Dark Tone Header Box */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 text-[#F8FAFC] shadow-md relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40">
              Student Career &amp; Skill Diagnostic
            </span>
            <span className="text-xs text-[#94A3B8]">Personalized Roadmap</span>
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-2 text-[#FFFFFF]">
            Evaluate Real Capabilities, Uncover Gaps, Match Opportunities
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Conventional grades often diverge from industry expectations. Add a skill like{' '}
            <strong className="text-[#FFFFFF] font-semibold">Python</strong>, evaluate your practical
            proficiency (e.g. <span className="font-semibold text-[#60A5FA] underline decoration-[#2563EB]">60%</span>) via scenario questions, choose your target goal (e.g.{' '}
            <strong className="text-[#FFFFFF] font-semibold">Machine Learning Engineer</strong>), and
            bridge the verified delta with accredited curriculum tracks and live job openings.
          </p>
        </div>
      </div>

      {/* SECTION 1: Dark Tone Box: Add & Evaluate Skills */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#1E3A8A] text-[#FFFFFF] border border-[#3B82F6]/50 flex items-center justify-center text-xs font-serif font-bold">
                1
              </span>
              <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">
                Add &amp; Evaluate Your Skills
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Take quick scenario assessments to test your technical competence against verified industry criteria
            </p>
          </div>

          {/* Custom skill adder */}
          <form onSubmit={handleAddCustomSkill} className="flex items-center gap-2">
            <input
              id="custom-skill-input"
              type="text"
              placeholder="e.g. PyTorch, TypeScript..."
              value={customSkillName}
              onChange={(e) => setCustomSkillName(e.target.value)}
              className="px-3.5 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-sm text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
            />
            <button
              id="add-custom-skill-btn"
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] text-xs font-medium flex items-center gap-1.5 transition border border-[#3B82F6]/40 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Evaluate</span>
            </button>
          </form>
        </div>

        {/* Popular Skills Quick Assess Grid */}
        <div className="mb-6">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block mb-3">
            Quick Assess Available Skills:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {POPULAR_SKILLS.map((sk) => {
              const alreadyAssessed = assessedSkills.find(
                (s) => s.skillId === sk.id || s.skillName === sk.name
              );
              return (
                <button
                  key={sk.id}
                  id={`assess-skill-${sk.id}`}
                  onClick={() => setActiveQuizSkill(sk)}
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    alreadyAssessed
                      ? 'border-[#2563EB] bg-[#1A2636] hover:bg-[#1E2D42]'
                      : 'border-[#223348] bg-[#0F1724] hover:border-[#3B82F6] hover:bg-[#162132]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#FFFFFF]">
                      {sk.name}
                    </span>
                    {alreadyAssessed ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2563EB] text-[#FFFFFF]">
                        {alreadyAssessed.score}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#94A3B8] font-normal">
                        3-5 Qs
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">
                    {alreadyAssessed ? 'Click to re-evaluate' : 'Start assessment →'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Assessed Skills Portfolio */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Your Evaluated Skills Portfolio ({assessedSkills.length}):
            </h4>
            <span className="text-[11px] text-[#64748B]">
              Scores reflect verified scenario test benchmarks
            </span>
          </div>

          {assessedSkills.length === 0 ? (
            <div className="p-6 rounded-lg border border-dashed border-[#2A3F58] bg-[#0F1724] text-center">
              <p className="text-sm text-[#94A3B8] mb-2">
                No skills evaluated yet. Click on any skill above (like Python) to test your baseline!
              </p>
              <button
                onClick={() => setActiveQuizSkill(POPULAR_SKILLS[0])}
                className="px-4 py-2 rounded-lg bg-[#2563EB] text-[#FFFFFF] text-xs font-medium hover:bg-[#1D4ED8] transition shadow-xs"
              >
                Assess Python (5 Questions)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {assessedSkills.map((item) => (
                <div
                  key={item.skillId}
                  className="p-4 rounded-lg border border-[#2A3F58] bg-[#0F1724] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-semibold text-[#FFFFFF]">{item.skillName}</h5>
                      <span className="text-[11px] text-[#94A3B8]">
                        Assessed level: {item.level}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-serif font-bold text-[#60A5FA]">
                        {item.score}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar in navy/cyan accent */}
                  <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.score >= 80
                          ? 'bg-[#38BDF8]'
                          : item.score >= 50
                          ? 'bg-[#2563EB]'
                          : 'bg-[#C9826B]'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1E2D44]">
                    <button
                      onClick={() => {
                        const sk =
                          POPULAR_SKILLS.find((s) => s.id === item.skillId) || {
                            id: item.skillId,
                            name: item.skillName,
                            category: 'Programming' as const,
                            questions: POPULAR_SKILLS[0].questions,
                          };
                        setActiveQuizSkill(sk);
                      }}
                      className="text-[#60A5FA] hover:text-[#93C5FD] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retake Test</span>
                    </button>
                    <button
                      onClick={() => handleRemoveSkill(item.skillId)}
                      className="text-[#64748B] hover:text-[#E07A5F] transition text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Dark Tone Box: Select a Goal & Gap Analysis */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#1E3A8A] text-[#FFFFFF] border border-[#3B82F6]/50 flex items-center justify-center text-xs font-serif font-bold">
                2
              </span>
              <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">
                Select Your Career Goal &amp; Analyze Skill Gaps
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Compare your current evaluated skill level against real industry hiring criteria
            </p>
          </div>

          {/* Goal Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8] font-medium">Target Role:</span>
            <select
              id="career-goal-select"
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
            >
              {CAREER_GOALS.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title} ({goal.hiringDemand} Demand)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Goal Highlight Box in Dark Tone */}
        <div className="bg-[#0B1320] border border-[#223348] rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-[#38BDF8]" />
              <h4 className="text-base font-serif font-bold text-[#FFFFFF]">{selectedGoal.title}</h4>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40">
                {selectedGoal.growthRate}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {selectedGoal.description}
            </p>
          </div>

          <div className="p-3 bg-[#131D2A] rounded-lg border border-[#223348]">
            <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-semibold block">
              Market Compensation
            </span>
            <span className="text-sm font-semibold text-[#FFFFFF] block mt-1">
              {selectedGoal.averageSalary}
            </span>
            <span className="text-[10px] text-[#64748B]">
              Verified by Q3 tech hiring benchmarks
            </span>
          </div>

          <div className="p-3 bg-[#131D2A] rounded-lg border border-[#223348] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                Your Readiness
              </span>
              <span className="text-base font-serif font-bold text-[#60A5FA]">
                {overallReadiness}%
              </span>
            </div>
            <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden my-1.5">
              <div
                className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                style={{ width: `${overallReadiness}%` }}
              />
            </div>
            <span className="text-[10px] text-[#94A3B8]">
              {overallReadiness >= 75
                ? 'Strong candidate for entry/associate roles'
                : 'Gap closure required before applying to top tiers'}
            </span>
          </div>
        </div>

        {/* Required Skill Set Table & Gap Visualization in Dark Tone */}
        <div className="overflow-x-auto rounded-lg border border-[#223348]">
          <table className="w-full text-left text-sm text-[#F8FAFC]">
            <thead className="bg-[#0B1320] text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-[#223348]">
              <tr>
                <th className="py-3 px-4">Required Skill Set</th>
                <th className="py-3 px-4">Importance</th>
                <th className="py-3 px-4">Industry Target</th>
                <th className="py-3 px-4">Your Evaluated Score</th>
                <th className="py-3 px-4">Gap Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D44] font-normal bg-[#0F1724]">
              {skillGapBreakdown.map((row) => (
                <tr key={row.skillName} className="hover:bg-[#162132]/60 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#FFFFFF] block">
                      {row.skillName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        row.importance === 'Core'
                          ? 'bg-[#2A1810] text-[#E07A5F] border border-[#C9826B]/50'
                          : row.importance === 'Recommended'
                          ? 'bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40'
                          : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'
                      }`}
                    >
                      {row.importance}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#FFFFFF]">
                    {row.requiredScore}%
                  </td>
                  <td className="py-3.5 px-4">
                    {row.currentScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#FFFFFF]">
                          {row.currentScore}%
                        </span>
                        <div className="w-16 bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              row.isMet ? 'bg-[#38BDF8]' : 'bg-[#C9826B]'
                            }`}
                            style={{ width: `${row.currentScore}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#64748B] text-xs italic">
                        Not evaluated yet (0%)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {row.isMet ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#38BDF8]">
                        <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                        Qualified (Met)
                      </span>
                    ) : row.currentScore > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E07A5F]">
                        <AlertCircle className="w-4 h-4 text-[#E07A5F]" />
                        {row.gap}% Gap to Bridge
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C9826B]">
                        <AlertCircle className="w-4 h-4 text-[#C9826B]" />
                        Missing Core Skill (-{row.requiredScore}%)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        const matched = POPULAR_SKILLS.find(
                          (s) => s.name.toLowerCase() === row.skillName.toLowerCase()
                        ) || {
                          id: `custom-${row.skillName.replace(/\s+/g, '-').toLowerCase()}`,
                          name: row.skillName,
                          category: 'Programming' as const,
                          questions: POPULAR_SKILLS[0].questions,
                        };
                        setActiveQuizSkill(matched);
                      }}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#1E293B] hover:bg-[#2563EB] text-[#FFFFFF] border border-[#334155] transition cursor-pointer"
                    >
                      {row.currentScore > 0 ? 'Retest' : 'Assess Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Dark Tone Box: Guided Courses to Bridge the Gap */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[#1E3A8A] text-[#FFFFFF] border border-[#3B82F6]/50 flex items-center justify-center text-xs font-serif font-bold">
              3
            </span>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">
                Recommended Curriculum to Close Gaps
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Accredited vocational and industry tracks targeting your exact deficits for{' '}
                <span className="text-[#FFFFFF] font-semibold">{selectedGoal.title}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-[#60A5FA] flex items-center gap-1 bg-[#1E2E44] px-3 py-1 rounded-md border border-[#2563EB]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            Curriculum Aligned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMMENDED_COURSES.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-[#0F1724] border border-[#223348] rounded-xl p-5 flex flex-col justify-between hover:border-[#38BDF8] transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-base font-serif font-bold text-[#FFFFFF]">
                      {course.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1E293B] border border-[#334155] text-[#94A3B8] shrink-0">
                      ★ {course.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mb-3">
                    Provider: <span className="text-[#FFFFFF] font-medium">{course.provider}</span> • {course.duration}
                  </p>

                  {/* Skills covered */}
                  <div className="mb-4">
                    <span className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wider block mb-1.5">
                      Bridges These Gaps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.coversGaps.map((gap, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#38BDF8]" />
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1E2D44]">
                  <span className="text-xs text-[#94A3B8]">
                    Level: {course.level}
                  </span>
                  <button
                    onClick={() => {
                      if (!isEnrolled) {
                        setEnrolledCourses([...enrolledCourses, course.id]);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                      isEnrolled
                        ? 'bg-[#1E2E44] text-[#60A5FA] border-[#2563EB]/40 cursor-default'
                        : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] border-[#3B82F6]/40'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isEnrolled ? '✓ Enrolled in Track' : 'Enroll in Track'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Dark Tone Box: Live Job Openings */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[#1E3A8A] text-[#FFFFFF] border border-[#3B82F6]/50 flex items-center justify-center text-xs font-serif font-bold">
              4
            </span>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">
                Job Openings Matching Current Skill Level
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Dynamic suitability score calculated from your verified evaluated skills
              </p>
            </div>
          </div>

          {/* Filter Buttons in Dark Tone */}
          <div className="flex items-center bg-[#0B1320] p-1 rounded-lg border border-[#223348] text-xs font-medium">
            <button
              onClick={() => setJobFilter('all')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                jobFilter === 'all'
                  ? 'bg-[#2563EB] text-[#FFFFFF] shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF]'
              }`}
            >
              All Openings ({calculatedJobs.length})
            </button>
            <button
              onClick={() => setJobFilter('ready')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                jobFilter === 'ready'
                  ? 'bg-[#0284C7] text-[#FFFFFF] shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF]'
              }`}
            >
              Eligible (≥60% Match)
            </button>
            <button
              onClick={() => setJobFilter('needs_upskill')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                jobFilter === 'needs_upskill'
                  ? 'bg-[#C9826B] text-[#FFFFFF] shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF]'
              }`}
            >
              Needs Upskilling (&lt;60%)
            </button>
          </div>
        </div>

        {/* Job Listings Grid in Dark Tone */}
        <div className="space-y-3.5">
          {filteredJobs.map((job) => {
            const matchScore = job.matchingScore || 0;
            const isHighMatch = matchScore >= 70;
            const isMediumMatch = matchScore >= 50 && matchScore < 70;

            return (
              <div
                key={job.id}
                className="bg-[#0F1724] border border-[#223348] rounded-xl p-5 hover:border-[#38BDF8] transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Job Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-serif font-bold text-[#FFFFFF]">
                        {job.title}
                      </h4>
                      <span className="text-xs font-medium text-[#FFFFFF] px-2.5 py-0.5 bg-[#1E293B] border border-[#334155] rounded-md">
                        {job.company}
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        • {job.location}
                      </span>
                    </div>

                    <p className="text-xs text-[#94A3B8] leading-relaxed max-w-3xl">
                      {job.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-[#94A3B8] font-medium mr-1">
                        Required:
                      </span>
                      {job.requiredSkills.map((sk, idx) => {
                        const hasSkill = assessedSkills.some(
                          (userS) =>
                            userS.skillName.toLowerCase() === sk.toLowerCase() &&
                            userS.score >= 50
                        );
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              hasSkill
                                ? 'bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40'
                                : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'
                            }`}
                          >
                            {hasSkill ? '✓ ' : ''}{sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Matching score & Apply Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1E2D44]">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-[#94A3B8] block">Match Score:</span>
                      <span
                        className={`text-xl font-serif font-bold ${
                          isHighMatch
                            ? 'text-[#38BDF8]'
                            : isMediumMatch
                            ? 'text-[#60A5FA]'
                            : 'text-[#E07A5F]'
                        }`}
                      >
                        {matchScore}%
                      </span>
                    </div>

                    <button
                      onClick={() => alert(`Redirecting to verified enterprise application portal for ${job.title} at ${job.company}. Skill telemetry attached!`)}
                      className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] text-xs font-medium transition shadow-xs cursor-pointer border border-[#3B82F6]/40"
                    >
                      Apply with Skill Profile →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Assessment Modal */}
      {activeQuizSkill && (
        <SkillAssessmentModal
          skill={activeQuizSkill}
          onClose={() => setActiveQuizSkill(null)}
          onSaveAssessment={handleSaveAssessment}
        />
      )}
    </div>
  );
};
