'use client';

import React, { useState } from 'react';
import { ModuleQuiz } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';
import {
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
} from 'lucide-react';

interface QuizModalProps {
  quiz: ModuleQuiz;
  isOpen: boolean;
  onClose: () => void;
}

export function QuizModal({ quiz, isOpen, onClose }: QuizModalProps) {
  const { recordQuizScore, fireConfetti } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;

  const handleSelectOption = (idx: number) => {
    if (revealed) return;
    setSelectedOption(idx);
    setRevealed(true);

    if (idx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = selectedOption === currentQuestion.correctIndex ? score + 1 : score;
      setIsFinished(true);
      recordQuizScore(quiz.moduleNumber, finalScore, quiz.questions.length);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setRevealed(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setRevealed(false);
    setScore(0);
    setIsFinished(false);
  };

  const percentage = Math.round((score / quiz.questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Module {quiz.moduleNumber} Knowledge Check
              </h3>
              <span className="text-xs text-slate-400 truncate block">
                {quiz.title}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isFinished ? (
            <div>
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono">
                  Question {currentIndex + 1} of {quiz.questions.length}
                </span>
                <span className="font-mono text-cyan-400">
                  Current Score: {score}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + (revealed ? 1 : 0)) / quiz.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <h4 className="text-base font-semibold text-slate-100 mb-5 leading-relaxed">
                {currentQuestion.question}
              </h4>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, idx) => {
                  let optionStyles = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300';

                  if (revealed) {
                    if (idx === currentQuestion.correctIndex) {
                      optionStyles = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-medium';
                    } else if (idx === selectedOption) {
                      optionStyles = 'bg-rose-950/60 border-rose-600 text-rose-200';
                    } else {
                      optionStyles = 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={revealed}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyles}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 ${
                          revealed && idx === currentQuestion.correctIndex
                            ? 'bg-emerald-600 text-white'
                            : revealed && idx === selectedOption
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {revealed && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 animate-in fade-in duration-200 mb-6">
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-xs uppercase tracking-wider">
                    {selectedOption === currentQuestion.correctIndex ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {revealed && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>{isLast ? 'View Results' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-950">
                {percentage >= 80 ? (
                  <Trophy className="w-8 h-8 animate-bounce" />
                ) : (
                  <Award className="w-8 h-8" />
                )}
              </div>

              <h4 className="text-xl font-bold text-white mb-2">
                {percentage >= 80 ? 'Mastery Achieved! 🎉' : 'Good Effort! Keep Learning 💪'}
              </h4>
              <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
                {percentage >= 80
                  ? `Outstanding score! You answered ${score} out of ${quiz.questions.length} questions correctly.`
                  : `You scored ${score} out of ${quiz.questions.length} (${percentage}%). Review the module days and try again.`}
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-xs mx-auto mb-6 flex items-center justify-around">
                <div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">{score}/{quiz.questions.length}</div>
                  <div className="text-[11px] text-slate-500">Correct</div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{percentage}%</div>
                  <div className="text-[11px] text-slate-500">Accuracy</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
