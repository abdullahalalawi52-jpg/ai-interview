import { collection, query, orderBy, getDocs, Timestamp, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

export interface ActivityData {
  id: string;
  type: 'interview' | 'quiz';
  createdAt: Timestamp;
  // Interview specific
  company?: string;
  jobTitle?: string;
  analysis?: {
    score: number;
  };
  // Quiz specific
  score?: number;
  total?: number;
}

export const activityService = {
  /**
   * Fetches user's activities (interviews and quizzes) sorted by date
   */
  async getUserActivities(userId: string, limitCount: number = 10): Promise<ActivityData[]> {
    const interviewsRef = collection(db, "users", userId, "interviews");
    const quizzesRef = collection(db, "users", userId, "quizzes");
    
    const [interviewsSnap, quizzesSnap] = await Promise.all([
      getDocs(query(interviewsRef, orderBy("createdAt", "desc"), limit(limitCount))),
      getDocs(query(quizzesRef, orderBy("createdAt", "desc"), limit(limitCount)))
    ]);
    
    const interviewsData = interviewsSnap.docs.map(doc => ({
      id: doc.id,
      type: 'interview' as const,
      ...doc.data()
    })) as ActivityData[];
    
    const quizzesData = quizzesSnap.docs.map(doc => ({
      id: doc.id,
      type: 'quiz' as const,
      ...doc.data()
    })) as ActivityData[];
    
    const mergedData = [...interviewsData, ...quizzesData].sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeB - timeA;
    });
    
    return mergedData.slice(0, limitCount);
  }
};
