import { useState, useEffect } from "react";
import { interviewService } from "@/services/interview.service";
import { useAuth } from "@/context/AuthContext";
import { InterviewConfig } from "@/types/interview";
import type { UIMessage } from "@ai-sdk/react";
import { extractMessageText } from "@/utils/messageUtils";

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
            return {
              role: m.role,
              content: extractMessageText(m)
            };
          });
          if (user) {
            const id = await interviewService.saveInterview(user.uid, {
              messages: sanitizedMessages,
              company: interviewConfig.company || "Google",
              jobTitle: interviewConfig.jobTitle || "Software Engineer",
              specialization: interviewConfig.specialization || "Web Development",
              interviewType: interviewConfig.interviewType,
              duration: elapsedTime
            }, INTERVIEW_COMPLETION_SCORE);
            setInterviewId(id);
          } else {
            const localId = interviewService.saveInterviewLocal({
              messages: sanitizedMessages,
              company: interviewConfig.company || "Google",
              jobTitle: interviewConfig.jobTitle || "Software Engineer",
              specialization: interviewConfig.specialization || "Web Development",
              interviewType: interviewConfig.interviewType,
              duration: elapsedTime
            });
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
