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
        // scale by score (e.g. 60% score gives 0.6 factor)
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
      {/* Calm, Warm Organic Header Banner */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 text-[#292A27] shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40">
              Student Career &amp; Skill Diagnostic
            </span>
            <span className="text-xs text-[#6F706A]">Personalized Roadmap</span>
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-2 text-[#292A27]">
            Evaluate Real Capabilities, Uncover Gaps, Match Opportunities
          </h2>
          <p className="text-sm text-[#6F706A] leading-relaxed">
            Conventional grades often diverge from industry expectations. Add a skill like{' '}
            <strong className="text-[#292A27] font-semibold">Python</strong>, evaluate your practical
            proficiency (e.g. <span className="font-semibold text-[#718C78] underline decoration-[#9AAA8F]">60%</span>) via scenario questions, choose your target goal (e.g.{' '}
            <strong className="text-[#292A27] font-semibold">Machine Learning Engineer</strong>), and
            bridge the verified delta with accredited curriculum tracks and live job openings.
          </p>
        </div>
      </div>

      {/* SECTION 1: Add a Skill & Evaluate */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/50 flex items-center justify-center text-xs font-serif font-bold">
                1
              </span>
              <h3 className="text-lg font-serif font-bold text-[#292A27]">
                Add &amp; Evaluate Your Skills
              </h3>
            </div>
            <p className="text-xs text-[#6F706A] mt-0.5">
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
              className="px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-sm text-[#292A27] placeholder-[#6F706A]/70 focus:outline-none focus:border-[#718C78]"
            />
            <button
              id="add-custom-skill-btn"
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-[#718C78] hover:bg-[#586F5E] text-[#FFFDFC] text-xs font-medium flex items-center gap-1.5 transition border border-[#586F5E]/30 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Evaluate</span>
            </button>
          </form>
        </div>

        {/* Popular Skills Quick Assess Grid */}
        <div className="mb-6">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block mb-3">
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
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    alreadyAssessed
                      ? 'border-[#9AAA8F] bg-[#EEF3EE]/60 hover:bg-[#EEF3EE]'
                      : 'border-[#DED8CE] bg-[#FAF7F2] hover:border-[#9AAA8F] hover:bg-[#FFFDFC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#292A27]">
                      {sk.name}
                    </span>
                    {alreadyAssessed ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#718C78] text-[#FFFDFC]">
                        {alreadyAssessed.score}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#6F706A] font-normal">
                        3-5 Qs
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#6F706A]">
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
            <h4 className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider">
              Your Evaluated Skills Portfolio ({assessedSkills.length}):
            </h4>
            <span className="text-[11px] text-[#6F706A]">
              Scores reflect verified scenario test benchmarks
            </span>
          </div>

          {assessedSkills.length === 0 ? (
            <div className="p-6 rounded-lg border border-dashed border-[#DED8CE] bg-[#FAF7F2] text-center">
              <p className="text-sm text-[#6F706A] mb-2">
                No skills evaluated yet. Click on any skill above (like Python) to test your baseline!
              </p>
              <button
                onClick={() => setActiveQuizSkill(POPULAR_SKILLS[0])}
                className="px-4 py-2 rounded-lg bg-[#C9826B] text-[#FFFDFC] text-xs font-medium hover:bg-[#B26E58] transition shadow-xs border border-[#B26E58]/30"
              >
                Assess Python (5 Questions)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {assessedSkills.map((item) => (
                <div
                  key={item.skillId}
                  className="p-4 rounded-lg border border-[#DED8CE] bg-[#FAF7F2] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-semibold text-[#292A27]">{item.skillName}</h5>
                      <span className="text-[11px] text-[#6F706A]">
                        Assessed level: {item.level}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-serif font-bold text-[#718C78]">
                        {item.score}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#DED8CE]/60 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.score >= 80
                          ? 'bg-[#718C78]'
                          : item.score >= 50
                          ? 'bg-[#9AAA8F]'
                          : 'bg-[#C9826B]'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DED8CE]">
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
                      className="text-[#718C78] hover:text-[#586F5E] font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retake Test</span>
                    </button>
                    <button
                      onClick={() => handleRemoveSkill(item.skillId)}
                      className="text-[#6F706A] hover:text-[#C9826B] transition text-[11px]"
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

      {/* SECTION 2: Select a Goal (e.g. ML Eng) & Skill Gap Analysis */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8] flex items-center justify-center text-xs font-serif font-bold">
                2
              </span>
              <h3 className="text-lg font-serif font-bold text-[#292A27]">
                Select Your Career Goal &amp; Analyze Skill Gaps
              </h3>
            </div>
            <p className="text-xs text-[#6F706A] mt-0.5">
              Compare your current evaluated skill level against real industry hiring criteria
            </p>
          </div>

          {/* Goal Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6F706A] font-medium">Target Role:</span>
            <select
              id="career-goal-select"
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#718C78]"
            >
              {CAREER_GOALS.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title} ({goal.hiringDemand} Demand)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Goal Highlight Box */}
        <div className="bg-[#FAF7F2] border border-[#DED8CE] rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-[#C9826B]" />
              <h4 className="text-base font-serif font-bold text-[#292A27]">{selectedGoal.title}</h4>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40">
                {selectedGoal.growthRate}
              </span>
            </div>
            <p className="text-xs text-[#6F706A] leading-relaxed">
              {selectedGoal.description}
            </p>
          </div>

          <div className="p-3 bg-[#FFFDFC] rounded-lg border border-[#DED8CE]">
            <span className="text-[11px] text-[#6F706A] uppercase tracking-wider font-semibold block">
              Market Compensation
            </span>
            <span className="text-sm font-semibold text-[#292A27] block mt-1">
              {selectedGoal.averageSalary}
            </span>
            <span className="text-[10px] text-[#6F706A]">
              Verified by Q3 tech hiring benchmarks
            </span>
          </div>

          <div className="p-3 bg-[#FFFDFC] rounded-lg border border-[#DED8CE] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6F706A] uppercase tracking-wider font-semibold">
                Your Readiness
              </span>
              <span className="text-base font-serif font-bold text-[#718C78]">
                {overallReadiness}%
              </span>
            </div>
            <div className="w-full bg-[#DED8CE]/60 h-2 rounded-full overflow-hidden my-1.5">
              <div
                className="bg-[#718C78] h-full rounded-full transition-all duration-500"
                style={{ width: `${overallReadiness}%` }}
              />
            </div>
            <span className="text-[10px] text-[#6F706A]">
              {overallReadiness >= 75
                ? 'Strong candidate for entry/associate roles'
                : 'Gap closure required before applying to top tiers'}
            </span>
          </div>
        </div>

        {/* Required Skill Set Table & Gap Visualization */}
        <div className="overflow-x-auto rounded-lg border border-[#DED8CE]">
          <table className="w-full text-left text-sm text-[#292A27]">
            <thead className="bg-[#FAF7F2] text-[11px] uppercase tracking-wider text-[#6F706A] border-b border-[#DED8CE]">
              <tr>
                <th className="py-3 px-4">Required Skill Set</th>
                <th className="py-3 px-4">Importance</th>
                <th className="py-3 px-4">Industry Target</th>
                <th className="py-3 px-4">Your Evaluated Score</th>
                <th className="py-3 px-4">Gap Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DED8CE] font-normal bg-[#FFFDFC]">
              {skillGapBreakdown.map((row) => (
                <tr key={row.skillName} className="hover:bg-[#FAF7F2]/60 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#292A27] block">
                      {row.skillName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        row.importance === 'Core'
                          ? 'bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8]'
                          : row.importance === 'Recommended'
                          ? 'bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40'
                          : 'bg-[#F5F0E8] text-[#6F706A] border border-[#DED8CE]'
                      }`}
                    >
                      {row.importance}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#292A27]">
                    {row.requiredScore}%
                  </td>
                  <td className="py-3.5 px-4">
                    {row.currentScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#292A27]">
                          {row.currentScore}%
                        </span>
                        <div className="w-16 bg-[#DED8CE]/60 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              row.isMet ? 'bg-[#718C78]' : 'bg-[#C9826B]'
                            }`}
                            style={{ width: `${row.currentScore}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#6F706A] text-xs italic">
                        Not evaluated yet (0%)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {row.isMet ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#586F5E]">
                        <CheckCircle2 className="w-4 h-4 text-[#718C78]" />
                        Qualified (Met)
                      </span>
                    ) : row.currentScore > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C9826B]">
                        <AlertCircle className="w-4 h-4 text-[#C9826B]" />
                        {row.gap}% Gap to Bridge
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B26E58]">
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
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF7F2] hover:bg-[#718C78] hover:text-[#FFFDFC] text-[#292A27] border border-[#DED8CE] transition"
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

      {/* SECTION 3: Guided Courses to Bridge the Gap */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/50 flex items-center justify-center text-xs font-serif font-bold">
              3
            </span>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#292A27]">
                Recommended Curriculum to Close Gaps
              </h3>
              <p className="text-xs text-[#6F706A]">
                Accredited vocational and industry tracks targeting your exact deficits for{' '}
                <span className="text-[#292A27] font-semibold">{selectedGoal.title}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-[#586F5E] flex items-center gap-1 bg-[#EEF3EE] px-3 py-1 rounded-md border border-[#9AAA8F]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#718C78]" />
            Curriculum Aligned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMMENDED_COURSES.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-[#FAF7F2] border border-[#DED8CE] rounded-xl p-5 flex flex-col justify-between hover:border-[#9AAA8F] transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-base font-serif font-bold text-[#292A27]">
                      {course.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFFDFC] border border-[#DED8CE] text-[#6F706A] shrink-0">
                      ★ {course.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F706A] mb-3">
                    Provider: <span className="text-[#292A27] font-medium">{course.provider}</span> • {course.duration}
                  </p>

                  {/* Skills covered */}
                  <div className="mb-4">
                    <span className="text-[11px] text-[#6F706A] font-semibold uppercase tracking-wider block mb-1.5">
                      Bridges These Gaps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.coversGaps.map((gap, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#718C78]" />
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#DED8CE]">
                  <span className="text-xs text-[#6F706A]">
                    Level: {course.level}
                  </span>
                  <button
                    onClick={() => {
                      if (!isEnrolled) {
                        setEnrolledCourses([...enrolledCourses, course.id]);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border shadow-xs ${
                      isEnrolled
                        ? 'bg-[#EEF3EE] text-[#586F5E] border-[#9AAA8F] cursor-default'
                        : 'bg-[#718C78] hover:bg-[#586F5E] text-[#FFFDFC] border-[#586F5E]/30'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isEnrolled ? '✓ Enrolled in Pathway' : 'Enroll in Track'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Live Job Openings based on Current Skill Level */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8] flex items-center justify-center text-xs font-serif font-bold">
              4
            </span>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#292A27]">
                Job Openings Matching Current Skill Level
              </h3>
              <p className="text-xs text-[#6F706A]">
                Dynamic suitability score calculated from your verified evaluated skills
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-lg border border-[#DED8CE] text-xs font-medium">
            <button
              onClick={() => setJobFilter('all')}
              className={`px-3 py-1.5 rounded-md transition ${
                jobFilter === 'all'
                  ? 'bg-[#FFFDFC] text-[#292A27] shadow-xs border border-[#DED8CE]'
                  : 'text-[#6F706A] hover:text-[#292A27]'
              }`}
            >
              All Openings ({calculatedJobs.length})
            </button>
            <button
              onClick={() => setJobFilter('ready')}
              className={`px-3 py-1.5 rounded-md transition ${
                jobFilter === 'ready'
                  ? 'bg-[#718C78] text-[#FFFDFC] shadow-xs'
                  : 'text-[#6F706A] hover:text-[#292A27]'
              }`}
            >
              Eligible (≥60% Match)
            </button>
            <button
              onClick={() => setJobFilter('needs_upskill')}
              className={`px-3 py-1.5 rounded-md transition ${
                jobFilter === 'needs_upskill'
                  ? 'bg-[#C9826B] text-[#FFFDFC] shadow-xs'
                  : 'text-[#6F706A] hover:text-[#292A27]'
              }`}
            >
              Needs Upskilling (&lt;60%)
            </button>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="space-y-3.5">
          {filteredJobs.map((job) => {
            const matchScore = job.matchingScore || 0;
            const isHighMatch = matchScore >= 70;
            const isMediumMatch = matchScore >= 50 && matchScore < 70;

            return (
              <div
                key={job.id}
                className="bg-[#FAF7F2] border border-[#DED8CE] rounded-xl p-5 hover:border-[#9AAA8F] transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Job Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-serif font-bold text-[#292A27]">
                        {job.title}
                      </h4>
                      <span className="text-xs font-medium text-[#292A27] px-2.5 py-0.5 bg-[#FFFDFC] border border-[#DED8CE] rounded-md">
                        {job.company}
                      </span>
                      <span className="text-xs text-[#6F706A]">
                        • {job.location}
                      </span>
                    </div>

                    <p className="text-xs text-[#6F706A] leading-relaxed max-w-3xl">
                      {job.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-[#6F706A] font-medium mr-1">
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
                                ? 'bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40'
                                : 'bg-[#FFFDFC] text-[#6F706A] border border-[#DED8CE]'
                            }`}
                          >
                            {hasSkill ? '✓ ' : ''}{sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Match Meter & Apply */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#DED8CE]">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs text-[#6F706A]">
                          Skill Match:
                        </span>
                        <span
                          className={`text-base font-serif font-bold ${
                            isHighMatch
                              ? 'text-[#586F5E]'
                              : isMediumMatch
                              ? 'text-[#C9826B]'
                              : 'text-[#6F706A]'
                          }`}
                        >
                          {matchScore}%
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6F706A] font-medium block">
                        {job.salary}
                      </span>
                    </div>

                    {/* Terracotta CTA for high match jobs */}
                    <button
                      onClick={() => alert(`Application initiated for "${job.title}" at ${job.company}. Your verified SkillSync evaluation profile will be attached.`)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-xs border ${
                        isHighMatch
                          ? 'bg-[#C9826B] hover:bg-[#B26E58] text-[#FFFDFC] border-[#B26E58]/30'
                          : 'bg-[#FFFDFC] hover:bg-[#F5F0E8] text-[#292A27] border-[#DED8CE]'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{isHighMatch ? 'Apply with Profile' : 'View Requirements'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Assessment Modal */}
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
