"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore/lite";
import { Question } from "@/types/quiz";

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

  const handleOpenConfig = () => {
    setGameState("config");
  };

  const handleStart = async () => {
    if (!companyName.trim() || !jobTitle.trim()) {
      alert(t("quiz.alerts.fillAll"));
      return;
    }

    setGameState("generating");
    
    try {
      const headers: Record<string, string> = { 
        "Content-Type": "application/json",
      };

      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers,
        body: JSON.stringify({
          company: companyName,
          jobTitle: jobTitle,
          count: selectedCount,
          language: language
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("يجب عليك تسجيل الدخول أولاً لإنشاء اختبار.");
        }
        throw new Error(t("quiz.alerts.apiError"));
      }

      const generatedQuestions: Question[] = await response.json();
      
      setActiveQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption(null);
      setGameState("playing");
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "";
      if (msg === "Failed to fetch" || msg.includes("fetch")) {
        alert(t("errors.network"));
      } else if (msg === "يجب عليك تسجيل الدخول أولاً لإنشاء اختبار.") {
        alert(msg);
      } else {
        alert(t("quiz.alerts.generateError") + " " + msg);
      }
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
            jobTitle: jobTitle || "مهندس برمجيات",
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
          <div className="glass-card w-full max-w-[32rem] p-12 rounded-[32px] text-center border-2 border-primary/20 shadow-xl slide-up">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
            <h2 className="font-headline-lg text-primary mb-2">{t("quiz.generating.title")}</h2>
            <p className="text-on-surface-variant font-body-lg animate-pulse">
              {t("quiz.generating.desc").replace("{{job}}", jobTitle).replace("{{company}}", companyName)}
            </p>
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
