import { useEffect, useRef } from "react";
import { UIMessage } from "ai";

export function useTextToSpeech(
  messages: UIMessage[],
  isLoading: boolean,
  language: string
) {
  const spokenTextLengthRef = useRef<Record<string, number>>({});
  const lastProcessedMessageId = useRef<string | null>(null);
  
  // Single utterance instance and a queue to prevent memory leaks
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !utteranceRef.current) {
      utteranceRef.current = new SpeechSynthesisUtterance();
      utteranceRef.current.onend = () => {
        if (queueRef.current.length > 0) {
          const nextText = queueRef.current.shift();
          if (nextText && utteranceRef.current) {
            utteranceRef.current.text = nextText;
            window.speechSynthesis.speak(utteranceRef.current);
          }
        } else {
          isSpeakingRef.current = false;
        }
      };
      utteranceRef.current.onerror = () => {
        isSpeakingRef.current = false;
      };
    }
  }, []);

  const lastMessage = messages[messages.length - 1];
  const lastMessageId = lastMessage?.id;
  const lastMessageRole = lastMessage?.role;
  
  const textPart = lastMessage?.parts?.find(
    (p: { type: string }) => p.type === "text"
  ) as { type: "text"; text: string } | undefined;

  const lastMessageText = textPart?.text || "";

  const enqueueSpeech = (text: string, lang: string) => {
    if (!utteranceRef.current) return;
    
    queueRef.current.push(text);
    
    if (!isSpeakingRef.current) {
      isSpeakingRef.current = true;
      const nextText = queueRef.current.shift();
      if (nextText) {
        utteranceRef.current.text = nextText;
        utteranceRef.current.lang = lang === "en" ? "en-US" : "ar-SA";
        window.speechSynthesis.speak(utteranceRef.current);
      }
    }
  };

  useEffect(() => {
    if (lastMessageRole === "assistant" && lastMessageId) {
      // If we switched to a new message, cancel any ongoing speech from previous ones
      if (lastProcessedMessageId.current !== lastMessageId) {
        window.speechSynthesis.cancel();
        queueRef.current = []; // Clear queue
        isSpeakingRef.current = false;
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
              enqueueSpeech(textToSpeak, language);
            }
          });

          spokenTextLengthRef.current[lastMessageId] = spokenLength + newlySpoken.length;
        } else if (!isLoading && unspokenPart.trim().length > 0) {
          // If the message finished streaming and there's trailing text without punctuation
          enqueueSpeech(unspokenPart.trim(), language);
          spokenTextLengthRef.current[lastMessageId] = fullText.length;
        }
      }
    }
  }, [lastMessageId, lastMessageRole, lastMessageText, isLoading, language]);
}
