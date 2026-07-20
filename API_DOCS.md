# API Documentation 🚀

This document outlines the available API endpoints for the AI Interview Prep application.

## 1. `POST /api/interview`
**Description:** Conducts a conversational mock interview using Gemini AI. It maintains context from previous messages and returns a streaming response.
**Authentication:** Required (Firebase Auth Bearer Token). *Note: Bypassed locally if `NODE_ENV === 'development'`.*
**Rate Limiting:** IP or User ID based.

### Request Body (JSON)
```ts
{
  "messages": [
    { "role": "user" | "assistant", "content": "string" }
  ],
  "company"?: "string",
  "jobTitle"?: "string",
  "specialization"?: "string",
  "interviewType"?: "technical" | "behavioral" | "mixed",
  "language"?: "ar" | "en", // Default: "ar"
  "resumeText"?: "string"
}
```

### Response
Returns a raw text stream containing the AI's response chunks.

---

## 2. `POST /api/gap-analyzer`
**Description:** Analyzes the completed interview transcript and provides a structured JSON report including score, strengths, weaknesses, and recommended topics.
**Authentication:** Required (Firebase Auth Bearer Token).

### Request Body (JSON)
```ts
{
  "messages": [
    { "role": "user" | "assistant", "content": "string" }
  ],
  "duration": number,
  "language": "ar" | "en"
}
```

### Response (JSON)
```ts
{
  "score": number, // 0 - 100
  "strengths": string[],
  "weaknesses": string[],
  "recommendedTopics": [
    {
      "topic": "string",
      "reason": "string"
    }
  ],
  "toneAnalysis"?: {
    "confidenceLevel": "string",
    "professionalism": "string",
    "feedback": "string"
  }
}
```
