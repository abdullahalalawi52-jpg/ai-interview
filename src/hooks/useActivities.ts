import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore/lite";
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

export function useActivities(userId: string | undefined | null) {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const interviewsRef = collection(db, "users", userId, "interviews");
        const quizzesRef = collection(db, "users", userId, "quizzes");
        
        const [interviewsSnap, quizzesSnap] = await Promise.all([
          getDocs(query(interviewsRef, orderBy("createdAt", "desc"))),
          getDocs(query(quizzesRef, orderBy("createdAt", "desc")))
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
        
        setActivities(mergedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch activities"));
      } finally {
        setLoading(false);
      }
    }
    
    fetchActivities();
  }, [userId]);

  return { activities, loading, error };
}
