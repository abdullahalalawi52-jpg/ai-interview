import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore/lite";
import { useAuth } from "@/context/AuthContext";
import { InterviewConfig } from "@/types/interview";
import type { UIMessage } from "@ai-sdk/react";

export function useInterviewSave(
  isFinished: boolean,
  messages: UIMessage[],
  interviewConfig: InterviewConfig,
  elapsedTime: number
) {
  const { user, loading } = useAuth();
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isFinished && !interviewId && !isSaving && !loading) {
      const saveInterview = async () => {
        setIsSaving(true);
        try {
          // Sanitize messages to save space and prevent hitting Firestore 1MB limit
          // Keep only essential fields (role, content) and limit to last 100 messages
          const sanitizedMessages = messages.slice(-100).map((m: UIMessage) => {
            const mObj = m as unknown as Record<string, unknown>;
            const textPart = m.parts?.find(p => p.type === 'text');
            const partText = textPart && 'text' in textPart ? String(textPart.text) : "";
            return {
              role: m.role,
              content: (mObj.content as string | undefined) || partText || (mObj.text as string | undefined) || ""
            };
          });
          const serializableMessages = structuredClone(sanitizedMessages);
          
          if (user) {
            const docRef = await addDoc(collection(db, "users", user.uid, "interviews"), {
              messages: serializableMessages,
              createdAt: serverTimestamp(),
              company: interviewConfig.company || "Google",
              jobTitle: interviewConfig.jobTitle || "Software Engineer",
              specialization: interviewConfig.specialization || "Web Development",
              interviewType: interviewConfig.interviewType,
              duration: elapsedTime
            });
            setInterviewId(docRef.id);
            
            // Increment leaderboard score (e.g., 50 points for completing an interview)
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              totalScore: increment(50)
            });
          } else {
            const localId = 'local_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
            localStorage.setItem(`interview_${localId}`, JSON.stringify({
              messages: serializableMessages,
              createdAt: new Date().toISOString(),
              company: interviewConfig.company || "Google",
              jobTitle: interviewConfig.jobTitle || "Software Engineer",
              specialization: interviewConfig.specialization || "Web Development",
              interviewType: interviewConfig.interviewType,
              duration: elapsedTime
            }));
            setInterviewId(localId);
          }
        } catch (error) {
          console.error("Error saving interview: ", error);
        } finally {
          setIsSaving(false);
        }
      };
      saveInterview();
    }
  }, [isFinished, messages, user, interviewId, isSaving, loading, interviewConfig, elapsedTime]);

  return { interviewId, isSaving };
}
