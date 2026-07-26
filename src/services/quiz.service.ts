import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

import { QuizData } from "@/types";
export const quizService = {
  /**
   * Saves a quiz result to Firestore and increments the user's score
   */
  async saveQuiz(uid: string, quizData: QuizData) {
    const docRef = await addDoc(collection(db, "users", uid, "quizzes"), {
      ...quizData,
      createdAt: serverTimestamp(),
    });
    
    const pointsEarned = quizData.score * 10;
    if (pointsEarned > 0) {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        totalScore: increment(pointsEarned)
      });
    }

    return docRef.id;
  },

  /**
   * Saves quiz result to local storage for guests
   */
  saveQuizLocal(quizData: QuizData): string {
    const localId = 'local_quiz_' + uuidv4();
    localStorage.setItem(`quiz_${localId}`, JSON.stringify({
      ...quizData,
      createdAt: new Date().toISOString(),
    }));
    return localId;
  }
};
