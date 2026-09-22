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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#292A27]/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl w-full max-w-2xl shadow-lg text-[#292A27] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DED8CE] bg-[#FAF7F2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40">
                Evaluation Diagnostic
              </span>
              <h3 className="text-lg font-serif font-bold text-[#292A27]">{skill.name} Assessment</h3>
            </div>
            <p className="text-xs text-[#6F706A] mt-0.5">
              Verify your practical industry readiness through scenario challenges
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#6F706A] hover:text-[#292A27] hover:bg-[#DED8CE]/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="p-6">
            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-[#6F706A] mb-1.5 font-medium">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-[#DED8CE]/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#718C78] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-base font-serif font-semibold text-[#292A27] mb-3">
              {currentQ.question}
            </h4>

            {/* Optional Code Snippet */}
            {currentQ.codeSnippet && (
              <pre className="bg-[#292A27] border border-[#292A27] p-3.5 rounded-lg text-xs font-mono text-[#E8C7B8] mb-4 overflow-x-auto">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}

            {/* Options */}
            <div className="space-y-2.5 mb-5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let optionStyle =
                  'border-[#DED8CE] bg-[#FAF7F2] hover:bg-[#FFFDFC] text-[#292A27]';

                if (showExplanation) {
                  if (isCorrect) {
                    optionStyle = 'border-[#718C78] bg-[#EEF3EE] text-[#292A27] font-medium';
                  } else if (isSelected) {
                    optionStyle = 'border-[#C9826B] bg-[#FAF1ED] text-[#292A27]';
                  } else {
                    optionStyle = 'border-[#DED8CE] bg-[#FAF7F2]/50 text-[#6F706A]';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-[#718C78] bg-[#EEF3EE] text-[#292A27] font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                  >
                    <span className="w-6 h-6 rounded-md border border-[#DED8CE] bg-[#FFFDFC] flex items-center justify-center text-xs font-semibold shrink-0 text-[#6F706A]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showExplanation && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-[#718C78] shrink-0" />
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-[#C9826B] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {showExplanation && (
              <div className="bg-[#EEF3EE] border border-[#9AAA8F]/50 p-3.5 rounded-lg mb-4 text-xs text-[#292A27]">
                <div className="flex items-center gap-1.5 font-semibold text-[#586F5E] mb-1">
                  <HelpCircle className="w-4 h-4 text-[#718C78]" />
                  <span>Concept Breakdown:</span>
                </div>
                <p className="text-[#292A27] leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#DED8CE]">
              <span className="text-xs text-[#6F706A]">
                Select an option to evaluate instantly
              </span>
              {showExplanation ? (
                <button
                  id="next-question-btn"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#718C78] hover:bg-[#586F5E] text-[#FFFDFC] text-sm font-medium transition shadow-xs border border-[#586F5E]/30"
                >
                  <span>
                    {currentQuestionIndex + 1 === questions.length ? 'View Results' : 'Next Question'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsCompleted(true)}
                  className="text-xs text-[#6F706A] hover:text-[#292A27] underline"
                >
                  Skip to Results &amp; Manual Score
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Completion & Evaluation Summary */
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-xl bg-[#EEF3EE] border border-[#9AAA8F]/50 text-[#718C78] flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-[#718C78]" />
            </div>

            <h4 className="text-xl font-serif font-bold text-[#292A27] mb-1">
              Assessment Completed
            </h4>
            <p className="text-sm text-[#6F706A] mb-5">
              Based on your responses, here is your industry-calibrated proficiency in {skill.name}.
            </p>

            {/* Big Score Card */}
            <div className="bg-[#FAF7F2] border border-[#DED8CE] p-5 rounded-xl max-w-sm mx-auto mb-6">
              <div className="text-4xl font-serif font-bold text-[#718C78] mb-1">
                {finalScore}%
              </div>
              <div className="inline-block px-3 py-1 rounded-md text-xs font-medium bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40 mb-2">
                Level: {determineLevel(finalScore)}
              </div>
              <p className="text-xs text-[#6F706A] leading-relaxed">
                {finalScore >= 80
                  ? 'Strong technical mastery. Prepared for mid-level industry assignments.'
                  : finalScore >= 50
                  ? 'Solid foundational knowledge. Targeted project practice recommended to bridge remaining delta.'
                  : 'Foundational baseline. Core programming concepts require focused practice.'}
              </p>
            </div>

            {/* Fast Score Simulation Slider */}
            <div className="bg-[#FAF7F2] border border-[#DED8CE] p-4 rounded-xl max-w-md mx-auto mb-6 text-left">
              <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                <span className="text-[#292A27]">Simulate or Fine-Tune Score:</span>
                <span className="text-[#718C78] font-bold">{finalScore}%</span>
              </div>
              <input
                id="score-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={finalScore}
                onChange={(e) => setOverrideScore(parseInt(e.target.value, 10))}
                className="w-full accent-[#718C78] h-2 bg-[#DED8CE] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6F706A] mt-1">
                <span>Beginner (30%)</span>
                <span className="text-[#718C78] font-semibold">Prompt Example (60%)</span>
                <span>Advanced (90%)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-[#DED8CE] text-[#6F706A] hover:text-[#292A27] hover:bg-[#FAF7F2] text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                id="save-skill-assessment-btn"
                onClick={handleFinalize}
                className="px-6 py-2.5 rounded-lg bg-[#C9826B] hover:bg-[#B26E58] text-[#FFFDFC] text-sm font-medium shadow-xs transition flex items-center gap-2 border border-[#B26E58]/30"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save to Profile &amp; Map Career Gaps</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
