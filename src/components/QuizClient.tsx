"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore/lite";
import { Question } from "@/types/quiz";
import { Skeleton } from "@/components/ui/Skeleton";
import { experimental_useObject as useObject } from 'ai/react';
import { z } from 'zod';

const questionSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number().optional(),
      category: z.string().optional(),
      question: z.string().optional(),
      options: z.array(z.string()).optional(),
      answer: z.number().optional(),
    })
  ).optional(),
});

import QuizStart from "@/components/quiz/QuizStart";
import QuizConfig from "@/components/quiz/QuizConfig";
import QuizPlaying from "@/components/quiz/QuizPlaying";
import QuizResult from "@/components/quiz/QuizResult";

export default function QuizClient() {
  const [gameState, setGameState] = useState<"start" | "config" | "generating" | "playing" | "result">("start");
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  // Customization state
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedCount, setSelectedCount] = useState<number>(5);
  
  // Active test state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = activeQuestions[currentQuestionIndex];

  const { submit, object, isLoading } = useObject({
    api: '/api/generate-quiz',
    schema: questionSchema,
    onFinish({ object: parsedObject }) {
      if (parsedObject?.questions) {
        setActiveQuestions(parsedObject.questions as Question[]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setGameState("playing");
      }
    },
    onError(error) {
      console.error("Quiz generation error:", error);
      toast.error(t("quiz.alerts.generateError") + " " + error.message);
      setGameState("config");
    }
  });

  const handleOpenConfig = () => {
    setGameState("config");
  };

  const handleStart = async () => {
    if (!companyName.trim() || !jobTitle.trim()) {
      toast.error(t("quiz.alerts.fillAll"));
      return;
    }

    setGameState("generating");
    
    try {
      submit({
        company: companyName,
        jobTitle: jobTitle,
        count: selectedCount,
        language: language
      });
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast.error(t("quiz.alerts.generateError"));
      setGameState("config");
    }
  };

  const handleNextQuestion = async () => {
    let finalScore = score;
    if (selectedOption === currentQuestion.answer) {
      finalScore += 1;
      setScore(finalScore);
    }

    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setGameState("result");
      
      // Save score to public leaderboard
      if (user) {
        try {
          // Save quiz history
          await addDoc(collection(db, "users", user.uid, "quizzes"), {
            company: companyName || "Google",
            jobTitle: jobTitle || t("defaults.softwareEngineer"),
            score: finalScore,
            total: activeQuestions.length,
            createdAt: serverTimestamp()
          });

          // e.g. 10 points per correct answer
          const pointsEarned = finalScore * 10;
          if (pointsEarned > 0) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              totalScore: increment(pointsEarned)
            });
          }
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    }
  };

  const resetQuiz = () => {
    setGameState("start");
  };

  return (
    <div className="flex flex-col flex-1 bg-surface text-on-surface min-h-screen">
      <Navbar />

      <main id="main-content" className="flex-1 flex flex-col items-center justify-center p-6 max-w-container-max mx-auto w-full py-12" tabIndex={-1}>
        
        {/* Start Screen */}
        {gameState === "start" && (
          <QuizStart onStart={handleOpenConfig} />
        )}

        {/* Config Screen */}
        {gameState === "config" && (
          <QuizConfig 
            companyName={companyName}
            setCompanyName={setCompanyName}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            selectedCount={selectedCount}
            setSelectedCount={setSelectedCount}
            onBack={resetQuiz}
            onGenerate={handleStart}
          />
        )}

        {/* Generating Screen */}
        {gameState === "generating" && (
          <div className="glass-card w-full max-w-4xl p-8 rounded-3xl border border-outline-variant/30 slide-up">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary animate-pulse">
              {t("quiz.generating.desc").replace("{{job}}", jobTitle).replace("{{company}}", companyName)}
            </h2>
            <div className="space-y-6">
              {object?.questions?.map((q, i) => (
                <div key={i} className="p-4 border border-outline-variant/50 rounded-xl bg-surface-container/50 slide-up">
                  <h3 className="font-semibold text-lg mb-3">
                    {q?.question || <Skeleton className="h-6 w-3/4 inline-block" />}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((optIdx) => (
                      <div key={optIdx} className="p-3 border border-outline-variant/30 rounded-lg min-h-[50px] flex items-center bg-surface-container">
                        {q?.options?.[optIdx] || <Skeleton className="h-5 w-1/2" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {(!object?.questions || object.questions.length < selectedCount) && (
                <div className="p-4 border border-outline-variant/50 rounded-xl bg-surface-container/50 opacity-50 slide-up">
                   <Skeleton className="h-6 w-3/4 mb-3" />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Skeleton className="h-[50px] w-full rounded-lg" />
                      <Skeleton className="h-[50px] w-full rounded-lg" />
                      <Skeleton className="h-[50px] w-full rounded-lg" />
                      <Skeleton className="h-[50px] w-full rounded-lg" />
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && activeQuestions.length > 0 && (
          <QuizPlaying 
            activeQuestions={activeQuestions}
            currentQuestionIndex={currentQuestionIndex}
            score={score}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            onNext={handleNextQuestion}
            onCancel={resetQuiz}
          />
        )}

        {/* Result Screen */}
        {gameState === "result" && (
          <QuizResult 
            score={score}
            totalQuestions={activeQuestions.length}
            jobTitle={jobTitle}
            companyName={companyName}
            onNewQuiz={() => setGameState("config")}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
