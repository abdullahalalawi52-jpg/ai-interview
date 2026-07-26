import { UIMessage } from "@ai-sdk/react";

/**
 * Safely extracts text content from an AI SDK message, handling both string content
 * and structured message parts.
 */
export function extractMessageText(message: Partial<UIMessage> | any): string {
  if (typeof message.content === 'string' && message.content.trim() !== '') {
    return message.content;
  }
  
  if (Array.isArray(message.parts)) {
    const textPart = message.parts.find((p: any) => p.type === 'text');
    if (textPart && typeof textPart.text === 'string') {
      return textPart.text;
    }
  }
  
  return "";
}
