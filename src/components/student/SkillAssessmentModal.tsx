import React, { useState } from 'react';
import { SkillItem, StudentAssessedSkill } from '../../types';
import { X, CheckCircle, XCircle, ArrowRight, Award, HelpCircle } from 'lucide-react';

interface SkillAssessmentModalProps {
  skill: SkillItem;
  onClose: () => void;
  onSaveAssessment: (assessed: StudentAssessedSkill) => void;
}

export const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  skill,
  onClose,
  onSaveAssessment,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [overrideScore, setOverrideScore] = useState<number | null>(null);

  const questions = skill.questions;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Calculate actual quiz score
  const correctCount = selectedAnswers.reduce((acc, ans, idx) => {
    return ans === questions[idx]?.correctIndex ? acc + 1 : acc;
  }, 0);
  const calculatedPercentage = Math.round((correctCount / questions.length) * 100);

  const finalScore = overrideScore !== null ? overrideScore : calculatedPercentage;

  const determineLevel = (score: number) => {
    if (score >= 80) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    return 'Beginner';
  };

  const handleFinalize = () => {
    const assessed: StudentAssessedSkill = {
      skillId: skill.id,
      skillName: skill.name,
      score: finalScore,
      level: determineLevel(finalScore),
      assessedAt: new Date().toISOString(),
    };
    onSaveAssessment(assessed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1320]/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl w-full max-w-2xl shadow-2xl text-[#FFFFFF] overflow-hidden">
        {/* Header in Dark Tone with Navy Accent */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#223348] bg-[#0F1724]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40">
                Evaluation Diagnostic
              </span>
              <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">{skill.name} Assessment</h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Verify your practical industry readiness through scenario challenges
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E293B] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="p-6">
            {/* Progress bar in navy */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-[#94A3B8] mb-1.5 font-medium">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-[#60A5FA]">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Completed
                </span>
              </div>
              <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card in Dark Tone */}
            <div className="bg-[#0F1724] border border-[#223348] rounded-xl p-5 mb-5 shadow-xs">
              <span className="text-[11px] font-semibold text-[#60A5FA] uppercase tracking-wider block mb-2">
                Industry Scenario Challenge:
              </span>
              <p className="text-base text-[#FFFFFF] font-medium leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options in Dark Tone */}
            <div className="space-y-2.5 mb-6">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optionClasses =
                  'border-[#2A3F58] bg-[#162132] hover:bg-[#1E2D42] text-[#F8FAFC]';

                if (showExplanation) {
                  if (isCorrect) {
                    optionClasses =
                      'border-[#38BDF8] bg-[#0C3048] text-[#FFFFFF] ring-1 ring-[#38BDF8]';
                  } else if (isSelected && !isCorrect) {
                    optionClasses =
                      'border-[#C9826B] bg-[#2D1612] text-[#FCA5A5] ring-1 ring-[#C9826B]';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition flex items-center justify-between cursor-pointer ${optionClasses}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-[#0F1724] border border-[#2A3F58] flex items-center justify-center text-xs font-semibold text-[#94A3B8]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </div>

                    {showExplanation && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-[#38BDF8] shrink-0" />
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-[#C9826B] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box in Dark Tone */}
            {showExplanation && (
              <div className="p-4 rounded-xl border border-[#223348] bg-[#0F1724] text-xs text-[#CBD5E1] mb-5 animate-in fade-in">
                <div className="flex items-center gap-2 mb-1.5 text-[#38BDF8] font-semibold">
                  <HelpCircle className="w-4 h-4" />
                  <span>Industry Best Practice Rationale:</span>
                </div>
                <p className="leading-relaxed pl-6">{currentQ.explanation}</p>
              </div>
            )}

            {/* Footer button */}
            <div className="flex justify-end pt-3 border-t border-[#223348]">
              {showExplanation ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] text-xs font-medium flex items-center gap-2 transition shadow-xs cursor-pointer border border-[#3B82F6]/40"
                >
                  <span>
                    {currentQuestionIndex + 1 === questions.length
                      ? 'View Diagnostic Results'
                      : 'Next Challenge'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-[#94A3B8] italic">
                  Select an answer above to reveal technical rationale
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Assessment Completion & Verified Score Result */
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#1E2E44] border border-[#2563EB]/40 flex items-center justify-center mx-auto text-[#60A5FA]">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#60A5FA]">
                Verification Complete
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#FFFFFF] mt-1">
                Your Evaluated {skill.name} Score:
              </h3>
            </div>

            {/* Big Score Card in Dark Tone */}
            <div className="max-w-xs mx-auto p-6 rounded-2xl bg-[#0F1724] border border-[#223348] shadow-md">
              <span className="text-5xl font-serif font-bold text-[#38BDF8] block">
                {finalScore}%
              </span>
              <span className="inline-block mt-2 px-3 py-1 rounded-md text-xs font-medium bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40">
                Industry Level: {determineLevel(finalScore)}
              </span>
              <p className="text-xs text-[#94A3B8] mt-3">
                {finalScore >= 70
                  ? 'Strong practical foundation aligned with junior/associate industry requirements.'
                  : finalScore >= 50
                  ? 'Moderate competence. Needs production testing and CI/CD best practice training.'
                  : 'Foundational gaps detected. Recommend foundational curriculum track.'}
              </p>
            </div>

            {/* Direct Score Adjustment Slider (e.g., test Python at 60% as user requested) */}
            <div className="max-w-md mx-auto p-4 bg-[#0F1724] rounded-xl border border-[#223348] text-left">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-[#FFFFFF]">Simulate Different Score:</span>
                <span className="font-serif font-bold text-[#60A5FA]">{finalScore}%</span>
              </div>
              <input
                id="modal-score-slider"
                type="range"
                min="0"
                max="100"
                step="5"
                value={finalScore}
                onChange={(e) => setOverrideScore(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] mt-1">
                <span>0% (Beginner)</span>
                <span className="text-[#38BDF8] font-bold">60% (Python Prompt Target)</span>
                <span>100% (Senior)</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-3 border-t border-[#223348]">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#2A3F58] text-[#94A3B8] hover:text-[#FFFFFF] text-xs font-medium cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleFinalize}
                className="px-6 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] text-xs font-medium transition shadow-xs cursor-pointer border border-[#3B82F6]/40"
              >
                Save to Skills Portfolio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
