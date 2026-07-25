export function getAtsSystemPrompt(jobDescription: string, language: string): string {
  return `أنت خبير توظيف ونظام ATS (Applicant Tracking System).
قم بتحليل السيرة الذاتية المرفقة (PDF) مقارنة بالوصف الوظيفي التالي.

الوصف الوظيفي (Job Description):
${jobDescription}

${language === 'en' ? 'CRITICAL: The entire JSON output, including all lists and strings (missingKeywords, strengths, improvementTips), MUST be written in English.' : 'CRITICAL: The entire JSON output, including all lists and strings, MUST be written in Arabic.'}`;
}
