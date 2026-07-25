import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore/lite";
import { useAuth } from "@/context/AuthContext";
import { InterviewConfig } from "@/types/interview";
import type { UIMessage } from "@ai-sdk/react";

const INTERVIEW_COMPLETION_SCORE = 50;

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
            // Type-safe extraction of content and parts to avoid TypeScript errors
            const messageData = m as unknown as { content?: string, parts?: Array<{ type: string, text?: string }> };
            const contentStr = typeof messageData.content === 'string' ? messageData.content : "";
            
            const parts = messageData.parts;
            const textPart = Array.isArray(parts) ? parts.find(p => p.type === 'text') : null;
            const partText = textPart && typeof textPart.text === 'string' ? textPart.text : "";
            
            return {
              role: m.role,
              content: contentStr || partText || ""
            };
          });
          if (user) {
            const docRef = await addDoc(collection(db, "users", user.uid, "interviews"), {
              messages: sanitizedMessages,
              createdAt: serverTimestamp(),
              company: interviewConfig.company || "Google",
              jobTitle: interviewConfig.jobTitle || "Software Engineer",
              specialization: interviewConfig.specialization || "Web Development",
              interviewType: interviewConfig.interviewType,
              duration: elapsedTime
            });
            setInterviewId(docRef.id);
            
            // Increment leaderboard score
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              totalScore: increment(INTERVIEW_COMPLETION_SCORE)
            });
          } else {
            const localId = 'local_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
            localStorage.setItem(`interview_${localId}`, JSON.stringify({
              messages: sanitizedMessages,
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
