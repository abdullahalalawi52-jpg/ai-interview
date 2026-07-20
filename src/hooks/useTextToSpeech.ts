import { useEffect, useRef } from "react";
import { UIMessage } from "ai";

export function useTextToSpeech(
  messages: UIMessage[],
  isLoading: boolean,
  language: string
) {
  const spokenTextLengthRef = useRef<Record<string, number>>({});
  const lastProcessedMessageId = useRef<string | null>(null);

  const lastMessage = messages[messages.length - 1];
  const lastMessageId = lastMessage?.id;
  const lastMessageRole = lastMessage?.role;
  
  const textPart = lastMessage?.parts?.find(
    (p: { type: string }) => p.type === "text"
  ) as { type: "text"; text: string } | undefined;

  const lastMessageText = textPart?.text || "";

  useEffect(() => {
    if (lastMessageRole === "assistant" && lastMessageId) {
      // If we switched to a new message, cancel any ongoing speech from previous ones
      if (lastProcessedMessageId.current !== lastMessageId) {
        window.speechSynthesis.cancel();
        lastProcessedMessageId.current = lastMessageId;
      }

      const fullText = lastMessageText;
      const spokenLength = spokenTextLengthRef.current[lastMessageId] || 0;

      if (fullText.length > spokenLength) {
        // extract the unspoken part
        const unspokenPart = fullText.slice(spokenLength);

        // Find if there is a sentence boundary (punctuation or newline)
        const sentenceMatch = unspokenPart.match(/([^.!?؟\n]+[.!?؟\n]+)/g);

        if (sentenceMatch) {
          let newlySpoken = "";
          sentenceMatch.forEach(sentence => {
            newlySpoken += sentence;
            const textToSpeak = sentence.trim();
            if (textToSpeak.length > 0) {
              const utterance = new SpeechSynthesisUtterance(textToSpeak);
              utterance.lang = language === "en" ? "en-US" : "ar-SA";
              window.speechSynthesis.speak(utterance);
            }
          });

          spokenTextLengthRef.current[lastMessageId] = spokenLength + newlySpoken.length;
        } else if (!isLoading && unspokenPart.trim().length > 0) {
          // If the message finished streaming and there's trailing text without punctuation
          const utterance = new SpeechSynthesisUtterance(unspokenPart.trim());
          utterance.lang = language === "en" ? "en-US" : "ar-SA";
          window.speechSynthesis.speak(utterance);
          spokenTextLengthRef.current[lastMessageId] = fullText.length;
        }
      }
    }
  }, [lastMessageId, lastMessageRole, lastMessageText, isLoading, language]);
}
