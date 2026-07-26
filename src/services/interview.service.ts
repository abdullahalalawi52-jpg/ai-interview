import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export interface InterviewData {
  messages: Array<{ role: string; content: string }>;
  company: string;
  jobTitle: string;
  specialization: string;
  interviewType: string;
  duration: number;
  createdAt?: unknown;
  analysis?: unknown;
}

export const interviewService = {
  /**
   * Saves an interview to Firestore for a logged-in user
   */
  async saveInterview(uid: string, interviewData: InterviewData, completionScore: number = 50) {
    const docRef = await addDoc(collection(db, "users", uid, "interviews"), {
      ...interviewData,
      createdAt: serverTimestamp(),
    });
    
    // Increment leaderboard score via user service logic (if needed directly here)
    const userRef = doc(db, "users", uid);
    // Alternatively, this could be handled by a specific method in userService to update score
    // using field value increment, but for now we'll do a simple read/write or keep the increment logic
    // actually, let's use the increment from firestore directly here, or we can just import increment
    
    // We need to import increment for this. I'll add it to the imports above.
    const { increment } = await import("firebase/firestore/lite");
    await updateDoc(userRef, {
      totalScore: increment(completionScore)
    });

    return docRef.id;
  },

  /**
   * Fetches an interview from Firestore
   */
  async getInterview(uid: string, interviewId: string) {
    const docRef = doc(db, "users", uid, "interviews", interviewId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  },

  /**
   * Updates an interview with analysis data
   */
  async updateInterviewAnalysis(uid: string, interviewId: string, analysisData: unknown) {
    const docRef = doc(db, "users", uid, "interviews", interviewId);
    await updateDoc(docRef, { analysis: analysisData });
  },

  /**
   * Saves an interview to local storage for guests
   */
  saveInterviewLocal(interviewData: InterviewData): string {
    const localId = 'local_' + uuidv4();
    localStorage.setItem(`interview_${localId}`, JSON.stringify({
      ...interviewData,
      createdAt: new Date().toISOString(),
    }));
    return localId;
  },

  /**
   * Fetches an interview from local storage
   */
  getInterviewLocal(interviewId: string) {
    const localDataStr = localStorage.getItem(`interview_${interviewId}`);
    if (localDataStr) {
      return JSON.parse(localDataStr);
    }
    return null;
  },

  /**
   * Updates a local interview with analysis data
   */
  updateInterviewAnalysisLocal(interviewId: string, analysisData: unknown) {
    const localDataStr = localStorage.getItem(`interview_${interviewId}`);
    if (localDataStr) {
      const data = JSON.parse(localDataStr);
      data.analysis = analysisData;
      localStorage.setItem(`interview_${interviewId}`, JSON.stringify(data));
    }
  }
};
